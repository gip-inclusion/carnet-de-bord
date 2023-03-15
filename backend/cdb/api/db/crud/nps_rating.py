from datetime import datetime
from uuid import UUID

from asyncpg.connection import Connection


async def get_latest_answer_ts(
    connection: Connection, account_uuid: UUID
) -> datetime | None:
    row = await connection.fetchrow(
        """
        SELECT GREATEST (
            (SELECT MAX(created_at)
               FROM nps_rating
              WHERE account_id = $1),
            (SELECT MAX(dismissed_at)
               FROM nps_rating_dismissal
              WHERE account_id = $1)
        ) AS "last_answer_ts"
        """,
        account_uuid,
    )
    return row["last_answer_ts"]


async def insert_nps_rating(
    connection: Connection, account_uuid: UUID, score: int
) -> None:
    await connection.execute(
        "INSERT INTO nps_rating (account_id, score) VALUES ($1, $2)",
        account_uuid,
        score,
    )
