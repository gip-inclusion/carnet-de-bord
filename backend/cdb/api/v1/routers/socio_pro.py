from typing import Annotated

from fastapi import APIRouter, Depends, Header
from gql import Client
from gql.transport.aiohttp import AIOHTTPTransport

from cdb.api.core.settings import settings
from cdb.api.db.graphql.socio_pro import (
    UpdateSocioProMutation,
    deny_orientation_gql,
    remove_none_from_dict,
)
from cdb.api.v1.dependencies import verify_secret_token

router = APIRouter(dependencies=[Depends(verify_secret_token)])


@router.post("/update")
async def update(
    mutation: UpdateSocioProMutation,
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
        # @TODO: Null from the first level should not be removed or e2e test will fail
        variables = remove_none_from_dict(mutation.gql_variables())

        await session.execute(
            deny_orientation_gql,
            variable_values=variables,
        )
