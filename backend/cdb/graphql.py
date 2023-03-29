#!/usr/bin/env python3

import textwrap

from gql import Client
from gql.transport.aiohttp import AIOHTTPTransport
from graphql import print_schema

from cdb.api.core.settings import settings


async def generate_schema_module() -> str:
    transport = AIOHTTPTransport(
        url=settings.graphql_api_url, headers={"X-Hasura-Admin-Secret": "admin"}
    )
    async with Client(transport=transport, fetch_schema_from_transport=True) as session:
        await session.fetch_schema()
        schema = print_schema(session.client.schema)
    return textwrap.dedent(
        """\
        from graphql import build_schema

        schema = build_schema(
            '''
        {indented_schema}
            '''
        )
        """
    ).format(indented_schema=textwrap.indent(schema, "    "))
