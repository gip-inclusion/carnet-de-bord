import zlib
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, conint

from cdb.api.core.init import connection
from cdb.api.db.crud.nps_rating import get_latest_answer_ts, insert_nps_rating
from cdb.api.db.models.role import RoleEnum
from cdb.api.v1.dependencies import allowed_jwt_roles, extract_authentified_account

router = APIRouter(
    dependencies=[
        Depends(
            allowed_jwt_roles(
                [
                    RoleEnum.ADMIN_CDB,
                    RoleEnum.ADMIN_STRUCTURE,
                    RoleEnum.MANAGER,
                    RoleEnum.ORIENTATION_MANAGER,
                    RoleEnum.PROFESSIONAL,
                ]
            )
        ),
        Depends(extract_authentified_account),
    ]
)


class NPSInput(BaseModel):
    score: conint(ge=0, le=10)


@router.post("", status_code=201)
async def create_nps_rating(
    data: NPSInput,
    request: Request,
    db=Depends(connection),
):
    account_uuid = UUID(request.state.account.id)
    lockkey = zlib.adler32(account_uuid.bytes)
    async with db.transaction():
        await db.execute("SELECT pg_advisory_xact_lock($1)", lockkey)
        last_answer_ts = await get_latest_answer_ts(db, account_uuid)
        if last_answer_ts and (
            datetime.now(tz=timezone.utc) - last_answer_ts
        ) < timedelta(days=14):
            raise HTTPException(
                status_code=403,
                detail="Le dernier score NPS a été enregistré il y a moins de 14 jours.",
            )
        await insert_nps_rating(db, account_uuid, data.score)
    return {}
