import logging
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, Header
from fastapi.exceptions import HTTPException
from gql import Client
from gql.dsl import DSLField, DSLMutation, DSLSchema, dsl_gql
from gql.transport.aiohttp import AIOHTTPTransport
from pydantic import BaseModel

from cdb.api.core.emails import Member, Person, send_notebook_member_email
from cdb.api.core.init import connection
from cdb.api.core.settings import settings
from cdb.api.db.crud.beneficiary_structure import (
    get_deactivate_beneficiary_structure_mutation,
    get_insert_beneficiary_structure_mutation,
)
from cdb.api.db.crud.notebook_event import get_insert_notebook_event_gql
from cdb.api.db.crud.notebook_info import get_insert_notebook_info_mutation
from cdb.api.db.crud.notebook_member import (
    get_deactivate_notebook_members_mutation,
    get_insert_former_referent_notebook_member_mutation,
    get_insert_notebook_member_mutation,
)
from cdb.api.db.crud.orientation_info import get_orientation_info
from cdb.api.db.crud.orientation_request import get_accept_orientation_request_mutation
from cdb.api.db.crud.orientation_system import get_orientation_system_by_id
from cdb.api.db.models.member_type import MemberTypeEnum
from cdb.api.db.models.notebook_event import EventType
from cdb.api.db.models.orientation_info import OrientationInfo
from cdb.api.db.models.orientation_system import OrientationSystem
from cdb.api.db.models.role import RoleEnum
from cdb.api.schema_gql import schema
from cdb.api.v1.dependencies import allowed_jwt_roles

router = APIRouter(
    dependencies=[
        Depends(
            allowed_jwt_roles(
                [
                    RoleEnum.ORIENTATION_MANAGER,
                    RoleEnum.MANAGER,
                ]
            )
        )
    ]
)


logger = logging.getLogger(__name__)


class ChangeBeneficiaryOrientationInput(BaseModel):
    notebook_id: UUID
    orientation_system_id: UUID
    structure_id: UUID
    orientation_request_id: UUID | None
    new_referent_account_id: UUID | None
    orientation_reason: str | None


@router.post("/change")
async def change_beneficiary_orientation(
    data: ChangeBeneficiaryOrientationInput,
    background_tasks: BackgroundTasks,
    authorization: str = Header(default=None),
    db=Depends(connection),
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
    - update the orientation_reason

    """
    transport = AIOHTTPTransport(
        url=settings.graphql_api_url,
        headers={"Authorization": authorization},
    )

    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:
        orientation_info: OrientationInfo = await get_orientation_info(
            session, data.notebook_id, data.structure_id, data.new_referent_account_id
        )

        orientation_system: OrientationSystem | None = None

        async with db.transaction():
            orientation_system = await get_orientation_system_by_id(
                db, data.orientation_system_id
            )

            if orientation_system is None:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        f"Orientation system with id '{data.orientation_system_id}' "
                        "not found."
                    ),
                )

        dsl_schema = DSLSchema(schema=schema)
        mutations: dict[str, DSLField] = {}

        if data.orientation_request_id:
            try:
                raise_if_orientation_request_not_match_notebook(
                    data.orientation_request_id,
                    UUID(
                        orientation_info.beneficiary.get("orientation_request", [{}])[
                            0
                        ].get("id")
                    )
                    if len(
                        orientation_info.beneficiary.get("orientation_request", [{}])
                    )
                    > 0
                    else None,
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
                dsl_schema, data.orientation_request_id, data.orientation_system_id
            )
        orientation_event = {
            "orientation": orientation_system.name,
            "structure": orientation_info.new_structure.get("name"),
            "referent": get_referent_name(orientation_info.new_referent)
            if orientation_info.new_referent
            else None,
            "previousOrientation": orientation_info.notebook["notebookInfo"][
                "orientationSystem"
            ]["name"]
            if orientation_info.notebook["notebookInfo"]
            and orientation_info.notebook["notebookInfo"]["orientationSystem"]
            else None,
            "previousReferent": get_referent_name(
                orientation_info.former_referents[0]["account"]["professional"]
            )
            if orientation_info.former_referent_account_id
            else None,
            "previousStructure": get_structure_name(
                orientation_info.beneficiary["structures"][0]["structure"]
            )
            if orientation_info.former_structure_ids
            else None,
        }
        mutations = mutations | get_insert_notebook_info_mutation(
            dsl_schema,
            data.notebook_id,
            data.orientation_system_id,
            data.orientation_reason,
        )

        structure_changed = (
            data.structure_id not in orientation_info.former_structure_ids
        )

        if structure_changed:
            mutations = mutations | get_deactivate_beneficiary_structure_mutation(
                dsl_schema, orientation_info.beneficiary.get("id")
            )
            mutations = mutations | get_insert_beneficiary_structure_mutation(
                dsl_schema, orientation_info.beneficiary.get("id"), data.structure_id
            )

        are_old_new_referents_different = str(data.new_referent_account_id) != str(
            orientation_info.former_referent_account_id
        )
        need_notebook_member_deactivation = (
            data.new_referent_account_id and are_old_new_referents_different
        ) or (
            orientation_info.former_referent_account_id
            and data.new_referent_account_id is None
        )
        if need_notebook_member_deactivation:
            mutations = mutations | get_deactivate_notebook_members_mutation(
                dsl_schema, data.notebook_id, data.new_referent_account_id
            )

            if orientation_info.former_referent_account_id:
                mutations = (
                    mutations
                    | get_insert_former_referent_notebook_member_mutation(
                        dsl_schema,
                        data.notebook_id,
                        orientation_info.former_referent_account_id,
                    )
                )

            if data.new_referent_account_id:
                mutations = mutations | get_insert_notebook_member_mutation(
                    dsl_schema,
                    data.notebook_id,
                    data.new_referent_account_id,
                    MemberTypeEnum.referent,
                )

        mutations = mutations | get_insert_notebook_event_gql(
            dsl_schema,
            data.notebook_id,
            EventType.orientation,
            datetime.now(),
            orientation_event,
        )

        response = await session.execute(dsl_gql(DSLMutation(**mutations)))

        former_referents = [
            Member.parse_from_gql(member.get("account", {}).get("professional", {}))
            for member in orientation_info.former_referents
        ]
        beneficiary = Person.parse_from_gql(orientation_info.beneficiary)

        for referent in former_referents:
            background_tasks.add_task(
                send_notebook_member_email,
                to_email=referent.email,
                beneficiary=beneficiary,
                orientation_system=orientation_system,
                former_referents=former_referents,
                new_structure=orientation_info.new_structure.get("name"),
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
                orientation_system=orientation_system,
                new_structure=orientation_info.new_structure["name"],
            )

        return response


def raise_if_orientation_request_not_match_notebook(
    orientation_request_id: UUID, beneficiary_request_id: UUID | None
) -> None:
    if orientation_request_id != beneficiary_request_id:
        raise Exception(
            f"orientation_request_id {orientation_request_id} does not match "
            f"beneficiary_request_id {beneficiary_request_id}"
        )


def get_referent_name(referent: dict[str, str]) -> str:
    return f'{referent.get("firstname")} {referent.get("lastname")}'


def get_structure_name(structure: dict[str, str]) -> str:
    return f'{structure.get("name")}'
