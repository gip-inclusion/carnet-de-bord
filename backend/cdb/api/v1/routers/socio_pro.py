from fastapi import APIRouter, Depends, Request

from cdb.api.core.init import connection

router = APIRouter()


@router.post("/update")
async def update(
    request: Request,
    db=Depends(connection),
):
    pass
