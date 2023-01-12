from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from cdb.api.db.models.rome_code import RomeCode


async def get_rome_code_by_description_and_code(
    connection: Connection, description: str, code: str
) -> RomeCode | None:

    async with connection.transaction():

        rome_code_record: Record | None = await connection.fetchrow(
            "SELECT public.rome_code.* FROM public.rome_code WHERE label = $1",
            f"{description} ({code})",
        )

        if rome_code_record:
            return RomeCode.parse_obj(rome_code_record)


async def get_rome_code_by_id(connection: Connection, rome_id: UUID) -> RomeCode | None:

    async with connection.transaction():

        rome_code_record: Record | None = await connection.fetchrow(
            "SELECT public.rome_code.* FROM public.rome_code WHERE id = $1",
            rome_id,
        )

        if rome_code_record:
            return RomeCode.parse_obj(rome_code_record)
