from typing import Dict

from gql import Client
from gql.transport.aiohttp import AIOHTTPTransport
from gql.utilities import update_schema_scalar

from cdb.api.core.settings import settings
from cdb.api.db.graphql.graphql_scalars import DateScalar
from cdb.api.schema_gql import schema


def gql_client(bearer_token: str) -> Client:
    return _get_client(
        headers={
            "Authorization": bearer_token,
        }
    )


def gql_client_backend_only(
    bearer_token: str | None = None,
    session_variables: Dict[str, str] | None = None,
) -> Client:
    return _get_client(
        headers={
            "x-hasura-admin-secret": settings.hasura_graphql_admin_secret,
            "x-hasura-use-backend-only-permissions": "true",
        }
        | (session_variables if session_variables is not None else {})
        | ({"Authorization": bearer_token} if bearer_token is not None else {})
    )


def _get_client(headers: dict[str, str]) -> Client:
    transport = AIOHTTPTransport(url=settings.graphql_api_url, headers=headers)
    client = Client(
        schema=schema,
        transport=transport,
        fetch_schema_from_transport=False,
        serialize_variables=True,
    )
    update_schema_scalar(client.schema, "date", DateScalar)
    return client
