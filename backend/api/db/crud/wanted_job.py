from uuid import UUID

from api.db.models.wanted_job import WantedJob
from asyncpg import Record
from asyncpg.connection import Connection


async def get_wanted_job_by_beneficiary_id(
    connection: Connection, b_id: UUID
) -> WantedJob | None:

    async with connection.transaction():
        return None
