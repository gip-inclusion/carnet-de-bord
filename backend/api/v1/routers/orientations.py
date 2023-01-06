import logging
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, Header
from fastapi.exceptions import HTTPException
from gql import Client
from gql.dsl import DSLField, DSLMutation, DSLSchema, dsl_gql
from gql.transport.aiohttp import AIOHTTPTransport
from pydantic import BaseModel

from api._gen.schema_gql import schema
from api.core.emails import Member, Person, send_notebook_member_email
from api.core.settings import settings
from api.db.crud.beneficiary_structure import (
    get_deactivate_beneficiary_structure_mutation,
    get_insert_beneficiary_structure_mutation,
)
from api.db.crud.notebook_info import get_insert_notebook_info_mutation
from api.db.crud.notebook_member import (
    get_deactivate_notebook_members_mutation,
    get_insert_former_referent_notebook_member_mutation,
    get_insert_notebook_member_mutation,
)
from api.db.crud.orientation_info import get_orientation_info
from api.db.crud.orientation_request import get_accept_orientation_request_mutation
from api.db.models.member_type import MemberTypeEnum
from api.db.models.orientation_info import OrientationInfo
from api.db.models.orientation_type import OrientationType
from api.db.models.role import RoleEnum
from api.v1.dependencies import allowed_jwt_roles

router = APIRouter(
    dependencies=[
        Depends(
            allowed_jwt_roles(
                [
                    RoleEnum.ORIENTATION_MANAGER,
                    RoleEnum.ADMIN_STRUCTURE,
                    RoleEnum.MANAGER,
                ]
            )
        )
    ]
)


logger = logging.getLogger(__name__)


class ChangeBeneficiaryOrientationInput(BaseModel):
    notebook_id: UUID
    orientation_type: OrientationType
    structure_id: UUID
    orientation_request_id: UUID | None
    new_referent_account_id: UUID | None


@router.post("/change")
async def change_beneficiary_orientation(
    data: ChangeBeneficiaryOrientationInput,
    background_tasks: BackgroundTasks,
    jwt_token: str = Header(default=None),
):
    """
    Change the beneficiary orientation

    Change beneficiary orientation allows an orientation manager
    to update the current orientation, structure attachement and referent
    based on an orientation request (or not)
    An orientation is represented by several tables
    - notebook_info holds the current orientation value,
    - orientation_request holds orientation_request infos
    - beneficiary_structure holds the relation between a structure and a beneficiary
    - notebook_member holds the relation of an account (pro, orientation_manager)
      with a notebook

    change_beneficiary_oriention will
    - close the orientation request (save the decision, date, chosen orientation)
    - deactivate the current beneficiary_structure and
      add the new beneficiary_structure if the structure has changed
    - deactivate the current notebook_member records (referent / no_referent)
    - add the new notebook_member records (referent / no-referent)

    """
    transport = AIOHTTPTransport(
        url=settings.graphql_api_url, headers={"Authorization": "Bearer " + jwt_token}
    )

    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:
        orientation_info: OrientationInfo = await get_orientation_info(
            session, data.notebook_id, data.structure_id, data.new_referent_account_id
        )

        dsl_schema = DSLSchema(schema=schema)
        mutations: dict[str, DSLField] = {}

        if data.orientation_request_id:

            try:
                raise_if_orientation_request_not_match_notebook(
                    str(data.orientation_request_id),
                    str(orientation_info.beneficiary["orientation_request"][0]["id"])
                    if len(orientation_info.beneficiary["orientation_request"]) > 0
                    else "",
                )
            except Exception as exception:
                logging.error(
                    "%s does not match notebook_id %s",
                    data.orientation_request_id,
                    data.notebook_id,
                )
                raise HTTPException(
                    status_code=400,
                    detail="orientation_request_id and beneficiary don't match",
                ) from exception

            mutations = mutations | get_accept_orientation_request_mutation(
                dsl_schema, data.orientation_request_id, data.orientation_type
            )

        mutations = mutations | get_insert_notebook_info_mutation(
            dsl_schema, data.notebook_id, data.orientation_type
        )

        structure_changed = str(data.structure_id) != str(
            orientation_info.former_structure_id
        )

        if structure_changed:
            mutations = mutations | get_deactivate_beneficiary_structure_mutation(
                dsl_schema, orientation_info.beneficiary["id"]
            )
            mutations = mutations | get_insert_beneficiary_structure_mutation(
                dsl_schema, orientation_info.beneficiary["id"], data.structure_id
            )

        has_new_referent = data.new_referent_account_id is not None
        are_old_new_referents_different = str(data.new_referent_account_id) != str(
            orientation_info.former_referent_account_id
        )
        need_notebook_member_deactivation = (
            has_new_referent and are_old_new_referents_different
        ) or (orientation_info.has_old_referent and not has_new_referent)
        if need_notebook_member_deactivation:
            mutations = mutations | get_deactivate_notebook_members_mutation(
                dsl_schema, data.notebook_id, data.new_referent_account_id
            )

            if orientation_info.has_old_referent:
                mutations = mutations | get_insert_former_referent_notebook_member_mutation(
                    dsl_schema,
                    data.notebook_id,
                    orientation_info.former_referent_account_id,  # pyright: ignore [reportGeneralTypeIssues]
                )

            if has_new_referent:
                mutations = mutations | get_insert_notebook_member_mutation(
                    dsl_schema,
                    data.notebook_id,
                    data.new_referent_account_id,  # pyright: ignore [reportGeneralTypeIssues]
                    MemberTypeEnum.referent,
                )

        response = await session.execute(dsl_gql(DSLMutation(**mutations)))

        former_referents = [
            Member.parse_from_gql(member["account"]["professional"])
            for member in orientation_info.former_referents
        ]
        beneficiary = Person.parse_from_gql(orientation_info.beneficiary)

        for referent in former_referents:
            background_tasks.add_task(
                send_notebook_member_email,
                to_email=referent.email,
                beneficiary=beneficiary,
                orientation=data.orientation_type,
                former_referents=former_referents,
                new_structure=orientation_info.new_structure["name"],
                new_referent=Member.parse_from_gql(orientation_info.new_referent)
                if orientation_info.new_referent is not None
                else None,
            )

        if orientation_info.new_referent is not None:
            new_referent = Member.parse_from_gql(orientation_info.new_referent)

            background_tasks.add_task(
                send_notebook_member_email,
                to_email=new_referent.email,
                new_referent=new_referent,
                beneficiary=beneficiary,
                former_referents=former_referents,
                orientation=data.orientation_type,
                new_structure=orientation_info.new_structure["name"],
            )

        return response


def raise_if_orientation_request_not_match_notebook(
    orientation_request_id: str, beneficiary_request_id: str
) -> None:

    if orientation_request_id != beneficiary_request_id:
        raise Exception(
            f"orientation_request_id {orientation_request_id} does not match beneficiary_request_id {beneficiary_request_id}"
        )
