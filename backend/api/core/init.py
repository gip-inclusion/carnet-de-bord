from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from api.core.db import get_connection_pool
from api.core.settings import settings


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

    @app.on_event("shutdown")
    async def shutdown():

        # cleanup
        pass

    from api.v1.main import api_router

    app.include_router(api_router, prefix=settings.V1_PREFIX)

    @app.get("/")
    async def read_root():
        return {"status": "running"}

    @app.get("/healthz")
    async def read_root():
        return {"status": "running"}

    return app


async def connection(request: Request):
    async with request.app.state.db.pool.acquire() as db:
        yield db


async def transaction(request: Request):
    async with request.app.state.db.pool.acquire() as db:
        txn = db.transaction()
        await txn.start()
        try:
            yield db
        except:  # noqa
            await txn.rollback()
            raise
        else:
            await txn.commit()
