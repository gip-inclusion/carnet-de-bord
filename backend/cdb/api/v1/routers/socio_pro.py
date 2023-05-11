from fastapi import APIRouter, Depends, Request
from gql import Client
from gql.transport.aiohttp import AIOHTTPTransport

from cdb.api.core.settings import settings
from cdb.api.db.graphql.socio_pro import (
    UpdateSocioProActionPayload,
    update_socio_pro_gql,
)
from cdb.api.v1.dependencies import verify_secret_token

router = APIRouter(dependencies=[Depends(verify_secret_token)])


@router.post("/update")
async def update(request: Request, payload: UpdateSocioProActionPayload):
    """
    Update the socio pro information of a notebook.
    It will create a notebook_event that will keep track of the modifications performed
    """
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
        await session.execute(
            update_socio_pro_gql,
            variable_values=payload.gql_variables(),
        )
