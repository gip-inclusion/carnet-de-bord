import logging
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Request, Response
from fastapi.exceptions import HTTPException
from gql import Client, gql
from gql.dsl import DSLMutation, DSLSchema, dsl_gql
from gql.transport.aiohttp import AIOHTTPTransport

from api.core.settings import gqlSchema, settings
from api.db.models.role import RoleEnum
from api.v1.dependencies import allowed_jwt_roles, extract_authentified_account_id

professional_only = allowed_jwt_roles([RoleEnum.PROFESSIONAL])
router = APIRouter(
    dependencies=[Depends(professional_only), Depends(extract_authentified_account_id)]
)


logger = logging.getLogger(__name__)


@router.post("/notebooks/{notebook_id}/members")
async def add_authentified_user_to_notebook(
    request: Request,
    notebook_id: UUID,
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
        schema = gqlSchema.get_schema()
        if not schema:
            raise HTTPException(
                status_code=500,
                detail="No graphql schema found",
            )
        dsl_schema = DSLSchema(schema)
        mutations = {
            "create_notebook_member": dsl_schema.mutation_root.insert_notebook_member_one.args(
                object={
                    "notebookId": str(notebook_id),
                    "accountId": str(request.state.account_id),
                    "memberType": "no_referent",
                },
            ).select(
                dsl_schema.notebook_member.id
            )
        }

        await session.execute(dsl_gql(DSLMutation(**mutations)))

        return Response(status_code=204)
