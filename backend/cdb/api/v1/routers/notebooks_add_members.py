import logging
from typing import Optional
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
from gql.dsl import DSLField, DSLMutation, DSLSchema, dsl_gql
from pydantic import BaseModel

from cdb.api.db.crud.beneficiary_structure import (
    get_deactivate_beneficiary_structure_mutation,
    get_insert_beneficiary_structure_mutation,
)
from cdb.api.db.crud.notebook_info import (
    get_insert_notebook_info_orientation_system_mutation,
)
from cdb.api.db.crud.notebook_member import (
    get_deactivate_notebook_members_mutation,
    get_insert_former_referent_notebook_member_mutation,
    get_insert_notebook_member_mutation,
)
from cdb.api.db.crud.orientation_info import get_orientation_info
from cdb.api.db.crud.orientation_system import get_available_orientation_systems_gql
from cdb.api.db.graphql.get_client import gql_client_backend_only
from cdb.api.db.models.member_type import MemberTypeEnum
from cdb.api.db.models.orientation_info import OrientationInfo
from cdb.api.db.models.role import RoleEnum
from cdb.api.schema_gql import schema
from cdb.api.v1.dependencies import allowed_jwt_roles, extract_authentified_account

logger = logging.getLogger(__name__)
router = APIRouter(
    dependencies=[
        Depends(extract_authentified_account),
        Depends(allowed_jwt_roles([RoleEnum.PROFESSIONAL])),
    ],
)


class AddNotebookMemberInput(BaseModel):
    member_type: MemberTypeEnum
    orientation: Optional[UUID]


@router.post("/{notebook_id}/members")
async def add_notebook_members(
    data: AddNotebookMemberInput,
    request: Request,
    notebook_id: UUID,
    background_tasks: BackgroundTasks,
    authorization: str = Header(default=None),
):
    """
    Add currently authenticated user as notebook_member of given notebook
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
    - set the referent orientation system for the beneficiary
    """

    if request.state.account.structure_id is None:
        raise HTTPException(
            status_code=403, detail="Unsufficient permission (structureId is missing)"
        )

    async with gql_client_backend_only(bearer_token=authorization) as session:
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
        if data.member_type is MemberTypeEnum.referent:
            available_orientation_systems = await get_available_orientation_systems_gql(
                session, request.state.account.professional_id
            )
            if data.orientation in available_orientation_systems:
                mutations |= get_insert_notebook_info_orientation_system_mutation(
                    dsl_schema, notebook_id, data.orientation
                )
            else:
                raise HTTPException(
                    status_code=422,
                    detail=(
                        "Le référent doit être rattaché au dispositif "
                        "d’accompagnement spécifié.",
                    ),
                )

        await session.execute(dsl_gql(DSLMutation(**mutations)))

        return Response(status_code=204)
