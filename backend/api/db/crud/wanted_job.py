from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.wanted_job import WantedJob


async def get_wanted_job_by_beneficiary_id(
    connection: Connection, b_id: UUID
) -> WantedJob | None:

    async with connection.transaction():
        return None
