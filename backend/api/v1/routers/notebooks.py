import logging
import os
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, Header, Request, Response
from fastapi.exceptions import HTTPException
from gql import Client, gql
from gql.dsl import DSLField, DSLMutation, DSLSchema, dsl_gql
from gql.transport.aiohttp import AIOHTTPTransport
from pydantic import BaseModel
from strenum import StrEnum

from api._gen.schema_gql import schema
from api.core.emails import Member, Person, send_notebook_member_email
from api.core.settings import settings
from api.db.models.role import RoleEnum
from api.v1.dependencies import allowed_jwt_roles, extract_authentified_account_id

professional_only = allowed_jwt_roles([RoleEnum.PROFESSIONAL])
router = APIRouter(
    dependencies=[Depends(professional_only), Depends(extract_authentified_account_id)]
)


logger = logging.getLogger(__name__)


class MemberTypeEnum(StrEnum):
    referent = "referent"
    no_referent = "no_referent"


class AddNotebookMemberInput(BaseModel):
    member_type: MemberTypeEnum


@router.post("/{notebook_id}/members")
async def add_notebook_members(
    data: AddNotebookMemberInput,
    request: Request,
    notebook_id: UUID,
    background_tasks: BackgroundTasks,
    jwt_token: str | None = Header(default=None),
):
    if not jwt_token:
        raise HTTPException(status_code=401, detail="unauthorized")

    transport = AIOHTTPTransport(
        url=settings.graphql_api_url, headers={"Authorization": "Bearer " + jwt_token}
    )

    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:

        orientation_info_response = await session.execute(
            gql(load_gql_file("orientation_info.gql")),
            variable_values={
                "notebook_id": str(notebook_id),
                "structure_id": str(notebook_id),  # TODO get proper structure_id
                "with_new_structure": False,
                "new_referent_account_id": str(request.state.account_id),
                "with_new_referent": True,
            },
        )

        dsl_schema = DSLSchema(schema=schema)

        mutations: dict[str, DSLField] = {}

        if data.member_type is MemberTypeEnum.referent:
            mutations = mutations | get_notebook_members_deactivation_mutation(
                request.state.account_id, notebook_id, dsl_schema
            )

            former_referent_account_id = None
            if orientation_info_response["notebook"][0]["former_referents"]:
                former_referent_account_id = orientation_info_response["notebook"][0][
                    "former_referents"
                ][0]["account"]["id"]
                print(former_referent_account_id)

            has_old_referent = former_referent_account_id is not None
            if has_old_referent:
                mutations = mutations | get_former_referent_mutation(
                    notebook_id, dsl_schema, former_referent_account_id
                )
                beneficiary = Person.parse_from_gql(
                    orientation_info_response["notebook"][0]["beneficiary"]
                )

                former_referents = [
                    Member.parse_from_gql(member["account"]["professional"])
                    for member in orientation_info_response["notebook"][0][
                        "former_referents"
                    ]
                ]

                for referent in former_referents:
                    background_tasks.add_task(
                        send_notebook_member_email,
                        to_email=referent.email,
                        beneficiary=beneficiary,
                        orientation=None,
                        former_referents=former_referents,
                        new_structure=None,
                        new_referent=Member.parse_from_gql(
                            orientation_info_response["newReferent"][0]
                        )
                        if "newReferent" in orientation_info_response
                        and len(orientation_info_response["newReferent"]) > 0
                        else None,
                    )

        mutations = mutations | get_new_notebook_member_mutation(
            data.member_type,
            request.state.account_id,
            notebook_id,
            dsl_schema,
        )

        await session.execute(dsl_gql(DSLMutation(**mutations)))

        return Response(status_code=204)


def get_new_notebook_member_mutation(
    member_type: MemberTypeEnum,
    account_id: UUID,
    notebook_id: UUID,
    dsl_schema: DSLSchema,
):
    return {
        "create_new_notebook_member_row": dsl_schema.mutation_root.insert_notebook_member_one.args(
            object={
                "notebookId": str(notebook_id),
                "accountId": str(account_id),
                "memberType": member_type.value,
            },
        ).select(
            dsl_schema.notebook_member.id
        )
    }


def get_former_referent_mutation(
    notebook_id: UUID,
    dsl_schema: DSLSchema,
    former_referent_account_id,
) -> dict[str, DSLField]:
    return {
        "create_former_referent_row": dsl_schema.mutation_root.insert_notebook_member_one.args(
            object={
                "notebookId": str(notebook_id),
                "accountId": str(former_referent_account_id),
                "memberType": "no_referent",
            },
        ).select(
            dsl_schema.notebook_member.id
        )
    }


def get_notebook_members_deactivation_mutation(
    account_id: UUID,
    notebook_id: UUID,
    dsl_schema: DSLSchema,
) -> dict[str, DSLField]:
    deactivation_clause = [
        {
            "notebookId": {"_eq": str(notebook_id)},
            "memberType": {"_eq": "referent"},
            "active": {"_eq": True},
        },
        {
            "notebookId": {"_eq": str(notebook_id)},
            "accountId": {"_eq": str(account_id)},
            "active": {"_eq": True},
        },
    ]

    return {
        "deactivate_changed_member_rows": dsl_schema.mutation_root.update_notebook_member.args(
            where={"_or": deactivation_clause},
            _set={
                "active": False,
                "membershipEndedAt": datetime.now().isoformat(),
            },
        ).select(
            dsl_schema.notebook_member_mutation_response.affected_rows
        )
    }


def load_gql_file(filename: str, path: str = os.path.dirname(__file__)):
    with open(os.path.join(path, filename), encoding="utf-8") as f:
        return f.read()
