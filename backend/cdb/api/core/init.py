import importlib.metadata
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from cdb.api.core.db import get_connection_pool
from cdb.api.core.settings import settings

logger = logging.getLogger(__name__)


class Database:
    async def create_pool(self) -> None:
        self.pool = await get_connection_pool(settings.database_url)


def create_app() -> FastAPI:
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.app_url],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.state.db = Database()

    @app.on_event("startup")
    async def startup():
        await app.state.db.create_pool()
        logger.info("Backend application startup (release " + get_version() + ")")

    @app.on_event("shutdown")
    async def shutdown():

        # cleanup
        pass

    from cdb.api.v1.main import api_router

    app.include_router(api_router, prefix=settings.V1_PREFIX)

    @app.get("/")
    async def read_root():
        return get_status()

    @app.get("/healthz")
    async def read_health():
        return get_status()

    def get_version() -> str:
        return importlib.metadata.version("cdb")

    def get_status() -> dict[str, str]:
        return {"status": "running", "version": get_version()}

    return app


async def connection(request: Request):
    async with request.app.state.db.pool.acquire() as db:
        yield db
