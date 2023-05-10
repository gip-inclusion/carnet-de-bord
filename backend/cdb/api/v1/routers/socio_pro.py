from typing import Annotated

from fastapi import APIRouter, Depends, Header
from gql import Client
from gql.transport.aiohttp import AIOHTTPTransport

from cdb.api.core.settings import settings
from cdb.api.db.graphql.socio_pro import (
    UpdateSocioProActionPayload,
    update_socio_pro_gql,
)
from cdb.api.v1.dependencies import extract_authentified_account, verify_secret_token

router = APIRouter(
    dependencies=[Depends(extract_authentified_account), Depends(verify_secret_token)]
)


@router.post("/update")
async def update(
    mutation: UpdateSocioProActionPayload,
    authorization: Annotated[str | None, Header()] = None,
):
    """
    Update the socio pro information of a notebook.
    It will create a notebook_event that will keep track of the modifications performed
    """

    transport = AIOHTTPTransport(
        url=settings.graphql_api_url,
        headers={
            "Authorization": authorization,
            "x-hasura-use-backend-only-permissions": "true",
            "x-hasura-admin-secret": settings.hasura_graphql_admin_secret,
        },
    )

    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:
        await session.execute(
            update_socio_pro_gql,
            variable_values=mutation.gql_variables(),
        )
