from gql import Client
from gql.transport.aiohttp import AIOHTTPTransport
from gql.utilities import update_schema_scalar

from cdb.api._gen.schema_gql import schema
from cdb.api.db.graphql.graphql_scalars import DateScalar


async def gql_client(url: str, headers: dict[str, str]) -> Client:
    transport = AIOHTTPTransport(url=url, headers=headers)
    client = Client(
        schema=schema,
        transport=transport,
        fetch_schema_from_transport=False,
        serialize_variables=True,
    )
    update_schema_scalar(client.schema, "date", DateScalar)

    return client
