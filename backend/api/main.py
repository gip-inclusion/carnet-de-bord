from urllib.request import Request

import sentry_sdk
from fastapi import FastAPI
from fastapi_asyncpg import configure_asyncpg

from api.core.settings import settings
from api.v1.main import api_router

app = FastAPI()

db = configure_asyncpg(app, settings.database_url)

sentry_sdk.init()


@db.on_init
async def initialization(conn):
    # you can run your db initialization code here
    result = await conn.execute("SELECT * from account")
    print(result)


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/healthz")
async def read_root():
    return {"whazza": "yolo"}


app.include_router(api_router, prefix=settings.V1_PREFIX)
