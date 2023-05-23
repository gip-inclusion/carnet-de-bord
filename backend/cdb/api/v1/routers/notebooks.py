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
from gql import Client
from gql.dsl import DSLField, DSLMutation, DSLSchema, dsl_gql
from gql.transport.aiohttp import AIOHTTPTransport
from pydantic import BaseModel

from cdb.api._gen.schema_gql import schema
from cdb.api.core.emails import Member, Person, send_notebook_member_email
from cdb.api.core.settings import settings
from cdb.api.db.crud.beneficiary import (
    get_insert_beneficiary_mutation,
)
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
from cdb.api.db.models.member_type import MemberTypeEnum
from cdb.api.db.models.orientation_info import OrientationInfo
from cdb.api.db.models.role import RoleEnum
from cdb.api.v1.dependencies import (
    allowed_jwt_roles,
    extract_authentified_account,
    verify_secret_token,
)
from cdb.api.v1.payloads.notebook import CreateNotebookActionPayload

professional_only = allowed_jwt_roles([RoleEnum.PROFESSIONAL])
router = APIRouter()


logger = logging.getLogger(__name__)


class AddNotebookMemberInput(BaseModel):
    member_type: MemberTypeEnum
    orientation: Optional[UUID]


@router.post(
    "/{notebook_id}/members",
    dependencies=[
        Depends(extract_authentified_account),
        Depends(allowed_jwt_roles([RoleEnum.PROFESSIONAL])),
    ],
)
async def add_notebook_members(
    data: AddNotebookMemberInput,
    request: Request,
    notebook_id: UUID,
    background_tasks: BackgroundTasks,
    authorization: str = Header(default=None),
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
    - set the referent orientation system for the beneficiary
    """

    transport = AIOHTTPTransport(
        url=settings.graphql_api_url,
        headers={"Authorization": authorization},
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


class CreatedNotebook(BaseModel):
    notebookId: str


@router.post("", status_code=201, dependencies=[Depends(verify_secret_token)])
async def create_beneficiary_notebook(
    _: Request,
    payload: CreateNotebookActionPayload,
):
    """
    This endpoint aims to create a beneficiary and its notebook from
    an external partner (**like RDV-Insertion**).

    This endpoint will:
    - ensure there is no existing beneficiary (nir shall be unique)
    - create beneficiary entity
    - create notebook entity
    - create beneficiary_structure to hold the relation between
        a structure and a beneficiary
    """
    logger.warn("++++++++ %s", payload.input.notebook)
    logger.warn("++++++++ %s", payload.session_variables)
    # TODO: refactor dans un helper pour réutilisation (c'est déjà un CTRL-C/CRTL-V)
    transport = AIOHTTPTransport(
        url=settings.graphql_api_url,
        headers={
            "x-hasura-use-backend-only-permissions": "true",
            "x-hasura-admin-secret": settings.hasura_graphql_admin_secret,
        }
        | payload.session_variables,
    )

    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:
        dsl_schema = DSLSchema(schema=schema)
        mutation = get_insert_beneficiary_mutation(
            dsl_schema=dsl_schema,
            deployment_id=payload.session_variables["x-hasura-deployment-id"],
            notebook=payload.input.notebook,
        )
        response = await session.execute(dsl_gql(DSLMutation(**mutation)))

    # TODO valider qu'on envoit la clé message dans les message d'erreur

    return CreatedNotebook(
        notebookId=response["create_beneficiary_with_notebook"]["notebook"]["id"]
    )
