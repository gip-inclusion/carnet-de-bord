from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.notebook_info import NotebookInfo, OrientationType


def parse_notebook_info(record: Record) -> NotebookInfo:
    return NotebookInfo.parse_obj(record)


async def insert_or_update_need_orientation(
    connection: Connection,
    notebook_id: UUID,
    orientation: OrientationType | None,
    need_orientation: bool,
) -> NotebookInfo | None:
    record = await connection.fetchrow(
        """
        INSERT INTO public.notebook_info (notebook_id, orientation, need_orientation)
        VALUES ($1, $2, $3)
        ON CONFLICT ON CONSTRAINT notebook_info_pkey
        DO UPDATE SET need_orientation = $3
        RETURNING notebook_id, orientation, need_orientation, created_at, updated_at
        """,
        notebook_id,
        orientation,
        need_orientation,
    )

    if record:
        return parse_notebook_info(record)


async def get_notebook_info(
    connection: Connection, notebook_id: UUID
) -> NotebookInfo | None:
    record = await connection.fetchrow(
        """
        SELECT * from public.notebook_info WHERE notebook=$1
        """,
        notebook_id,
    )

    if record:
        return NotebookInfo.parse_obj(record)
