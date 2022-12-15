from fastapi import APIRouter
from gql import Client
from gql.dsl import DSLQuery, DSLSchema, dsl_gql
from gql.transport.aiohttp import AIOHTTPTransport

from api.core.settings import gqlSchema, settings
from api.v1.routers import (
    admin_structures,
    beneficiaries,
    change_beneficiary_orientation,
    csv2json,
    managers,
    structures,
    uploads,
)

api_router = APIRouter()
api_router.include_router(uploads.router, prefix="/uploads", tags=["uploads"])
api_router.include_router(managers.router, prefix="/managers", tags=["managers"])
api_router.include_router(
    admin_structures.router, prefix="/admin_structures", tags=["admin_structures"]
)
api_router.include_router(
    csv2json.router, prefix="/convert-file", tags=["Csv to Json parsing"]
)
api_router.include_router(structures.router, prefix="/structures", tags=["structures"])
api_router.include_router(
    beneficiaries.router,
    prefix="/beneficiaries",
    tags=["Import or reimport beneficiaries"],
)
api_router.include_router(
    change_beneficiary_orientation.router, tags=["Orientation", "Réorientation"]
)


@api_router.get("/gql")
async def getSchema():
    schema = gqlSchema.get_schema()
    transport = AIOHTTPTransport(url=settings.graphql_api_url)

    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:
        ds = DSLSchema(schema)
        print(ds.structure)
        query = dsl_gql(DSLQuery(ds.query_root.structure.select(ds.structure.name)))
        print(query)
        result = await session.execute(query)
        print(result)
        return result
