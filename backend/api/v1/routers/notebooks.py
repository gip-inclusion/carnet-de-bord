import logging
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, Header, Request, Response
from gql import Client
from gql.dsl import DSLField, DSLMutation, DSLSchema, dsl_gql
from gql.transport.aiohttp import AIOHTTPTransport
from pydantic import BaseModel

from api._gen.schema_gql import schema
from api.core.emails import Member, Person, send_notebook_member_email
from api.core.settings import settings
from api.db.crud.beneficiary_structure import (
    deactivate_beneficiary_structure,
    insert_beneficiary_structure,
)
from api.db.crud.notebook_member import (
    deactivate_notebook_members,
    insert_former_referent_notebook_member,
    insert_notebook_member,
)
from api.db.crud.orientation_info import get_orientation_info
from api.db.models.member_type import MemberTypeEnum
from api.db.models.role import RoleEnum
from api.v1.dependencies import allowed_jwt_roles, extract_authentified_account

professional_only = allowed_jwt_roles([RoleEnum.PROFESSIONAL])
router = APIRouter(
    dependencies=[Depends(professional_only), Depends(extract_authentified_account)]
)


logger = logging.getLogger(__name__)


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
    """
    Add currently authentified user as notebook_member of given notebook
    The relationship between a user and a notebook is represented by:
    - beneficiary_structure holds the relation between a structure and a beneficiary
    - notebook_member holds the relation of an account (pro, orientation_manager)
      with a notebook

    This endpoint will, in every case:
    - add the new notebook_member records (referent / no-referent)

    Furthermore, if the user is added to notebook as referent, it will:
    - deactivate the current beneficiary_structure and
      add the new beneficiary_structure
    - deactivate the current referent in notebook_member records
    """

    transport = AIOHTTPTransport(
        url=settings.graphql_api_url,
        headers={
            "Authorization": "Bearer "
            + jwt_token  # pyright: ignore [reportGeneralTypeIssues]
        },
    )

    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:
        orientation_info = await get_orientation_info(
            session,
            notebook_id,
            request.state.account.structure_id,
            request.state.account.id,
        )

        dsl_schema = DSLSchema(schema=schema)

        mutations: dict[str, DSLField] = {}

        if data.member_type is MemberTypeEnum.referent:
            mutations = mutations | deactivate_notebook_members(
                dsl_schema, notebook_id, request.state.account.id
            )

            if (
                orientation_info.has_old_referent
                and orientation_info.former_referent_account_id is not None
            ):
                mutations = mutations | insert_former_referent_notebook_member(
                    dsl_schema, notebook_id, orientation_info.former_referent_account_id
                )
                beneficiary = Person.parse_from_gql(orientation_info.beneficiary)

                former_referents = [
                    Member.parse_from_gql(member["account"]["professional"])
                    for member in orientation_info.former_referents
                ]
                for referent in former_referents:
                    background_tasks.add_task(
                        send_notebook_member_email,
                        to_email=referent.email,
                        beneficiary=beneficiary,
                        orientation=None,
                        former_referents=former_referents,
                        new_structure=orientation_info.new_structure["name"],
                        new_referent=Member.parse_from_gql(
                            orientation_info.new_referent
                        )
                        if orientation_info.new_referent is not None
                        else None,
                    )

        mutations = mutations | insert_notebook_member(
            dsl_schema,
            notebook_id,
            request.state.account.id,
            data.member_type,
        )

        mutations = mutations | deactivate_beneficiary_structure(
            dsl_schema,
            orientation_info.beneficiary["id"],
        )
        mutations = mutations | insert_beneficiary_structure(
            dsl_schema,
            orientation_info.beneficiary["id"],
            request.state.account.structure_id,
        )

        await session.execute(dsl_gql(DSLMutation(**mutations)))

        return Response(status_code=204)
