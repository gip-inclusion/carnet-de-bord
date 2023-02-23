import logging
from uuid import UUID

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    Header,
    HTTPException,
    Request,
    Response,
)
from gql import Client
from gql.dsl import DSLField, DSLMutation, DSLSchema, dsl_gql
from gql.transport.aiohttp import AIOHTTPTransport
from pydantic import BaseModel

from cdb.api._gen.schema_gql import schema
from cdb.api.core.emails import Member, Person, send_notebook_member_email
from cdb.api.core.settings import settings
from cdb.api.db.crud.beneficiary_structure import (
    get_deactivate_beneficiary_structure_mutation,
    get_insert_beneficiary_structure_mutation,
)
from cdb.api.db.crud.notebook_member import (
    get_deactivate_notebook_members_mutation,
    get_insert_former_referent_notebook_member_mutation,
    get_insert_notebook_member_mutation,
)
from cdb.api.db.crud.orientation_info import get_orientation_info
from cdb.api.db.models.member_type import MemberTypeEnum
from cdb.api.db.models.orientation_info import OrientationInfo
from cdb.api.db.models.role import RoleEnum
from cdb.api.v1.dependencies import allowed_jwt_roles, extract_authentified_account

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
    jwt_token: str = Header(default=None),
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
        url=settings.graphql_api_url, headers={"Authorization": "Bearer " + jwt_token}
    )

    if request.state.account.structure_id is None:
        raise HTTPException(
            status_code=403, detail="Unsufficient permission (structureId is missing)"
        )

    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:
        orientation_info: OrientationInfo = await get_orientation_info(
            session,
            notebook_id,
            request.state.account.structure_id,
            request.state.account.id,
        )

        dsl_schema = DSLSchema(schema=schema)

        mutations: dict[str, DSLField] = {}

        if data.member_type is MemberTypeEnum.referent:
            mutations = mutations | get_deactivate_notebook_members_mutation(
                dsl_schema, notebook_id, request.state.account.id
            )
            mutations = mutations | get_deactivate_beneficiary_structure_mutation(
                dsl_schema,
                orientation_info.beneficiary["id"],
            )
            mutations = mutations | get_insert_beneficiary_structure_mutation(
                dsl_schema,
                orientation_info.beneficiary["id"],
                request.state.account.structure_id,
            )
            if orientation_info.former_referent_account_id:
                mutations = (
                    mutations
                    | get_insert_former_referent_notebook_member_mutation(
                        dsl_schema,
                        notebook_id,
                        orientation_info.former_referent_account_id,
                    )
                )

        mutations = mutations | get_insert_notebook_member_mutation(
            dsl_schema,
            notebook_id,
            request.state.account.id,
            data.member_type,
        )

        await session.execute(dsl_gql(DSLMutation(**mutations)))

        if (
            data.member_type is MemberTypeEnum.referent
            and orientation_info.former_referent_account_id
        ):
            notify_former_referents(background_tasks, orientation_info)

        return Response(status_code=204)


def notify_former_referents(
    background_tasks: BackgroundTasks, orientation_info: OrientationInfo
) -> None:
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
            orientation_system=None,
            former_referents=former_referents,
            new_structure=orientation_info.new_structure["name"],
            new_referent=Member.parse_from_gql(orientation_info.new_referent)
            if orientation_info.new_referent is not None
            else None,
        )
