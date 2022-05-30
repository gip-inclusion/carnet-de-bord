from fastapi import APIRouter, Depends

from api.main import db

test_views = APIRouter()


@test_views.get("/healthz")
async def read_root():
    return {"whazza": "yolo"}


@test_views.get("/")
async def read_root(db=Depends(db.connection)):
    print(db)
    rows = await db.fetch("SELECT * FROM beneficiary")
    print(rows)
    return rows
