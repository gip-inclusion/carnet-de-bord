from fastapi import FastAPI

from api.core.db import get_connection_pool
from api.core.settings import settings


class Database:
    async def create_pool(self):
        self.pool = await get_connection_pool(settings.database_url)


def create_app() -> FastAPI:
    app = FastAPI()
    db = Database()

    @app.on_event("startup")
    async def startup():
        await db.create_pool()

    @app.on_event("shutdown")
    async def shutdown():
        # cleanup
        pass

    from api.v1.main import api_router

    app.include_router(api_router, prefix=settings.V1_PREFIX)

    return app
