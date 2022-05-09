from typing import Optional

import sentry_sdk
from fastapi import FastAPI

app = FastAPI()

sentry_sdk.init()


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/healthz")
async def read_root():
    return {"whazza": "yolo"}
