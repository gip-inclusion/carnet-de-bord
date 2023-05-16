import zlib
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, conint

from cdb.api.core.init import connection
from cdb.api.db.crud.nps_rating import get_latest_answer_ts, insert_nps_rating
from cdb.api.v1.dependencies import verify_secret_token
from cdb.api.v1.payloads.hasura_action import HasuraActionPayload

router = APIRouter(dependencies=[Depends(verify_secret_token)])


class NPSInput(BaseModel):
    score: conint(ge=0, le=10)


class NPSRatingActionPayload(HasuraActionPayload):
    input: NPSInput


@router.post("", status_code=201)
async def create_nps_rating(
    _: Request,
    payload: NPSRatingActionPayload,
    db=Depends(connection),
):
    account_uuid = UUID(payload.session_variables.get("x-hasura-user-id"))
    lockkey = zlib.adler32(account_uuid.bytes)
    async with db.transaction():
        await db.execute("SELECT pg_advisory_xact_lock($1)", lockkey)
        last_answer_ts = await get_latest_answer_ts(db, account_uuid)
        if last_answer_ts and (
            datetime.now(tz=timezone.utc) - last_answer_ts
        ) < timedelta(days=14):
            raise HTTPException(
                status_code=403,
                detail=(
                    "Le dernier score NPS a été enregistré il y a moins de 14 jours."
                ),
            )
        await insert_nps_rating(db, account_uuid, payload.input.score)
    return {}
