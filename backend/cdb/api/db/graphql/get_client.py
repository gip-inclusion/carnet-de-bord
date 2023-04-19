from gql import Client
from gql.transport.aiohttp import AIOHTTPTransport
from gql.utilities import update_schema_scalar

from cdb.api._gen.schema_gql import schema
from cdb.api.core.settings import settings
from cdb.api.db.graphql.graphql_scalars import DateScalar


def gql_client(url: str, token: str) -> Client:
    return _get_client(
        headers={
            "Authorization": "Bearer " + token,
        }
    )


def gql_client_backend_only(token: str) -> Client:
    return _get_client(
        headers={
            "x-hasura-admin-secret": settings.hasura_graphql_admin_secret,
            "x-hasura-use-backend-only-permissions": "true",
            "Authorization": "Bearer " + token,
        }
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
