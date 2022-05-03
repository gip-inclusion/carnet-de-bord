from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.rome_code import RomeCode


async def get_rome_code_by_label_and_code(
    connection: Connection, label: str, code: str
) -> RomeCode | None:

    async with connection.transaction():

        rome_code_record: Record | None = await connection.fetchrow(
            "SELECT public.rome_code.* FROM public.rome_code WHERE label = $1",
            f"{label} ({code})",
        )

        if rome_code_record:
            return RomeCode.parse_obj(rome_code_record)
