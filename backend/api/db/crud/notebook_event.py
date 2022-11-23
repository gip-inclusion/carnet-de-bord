from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.notebook_event import EventType, NotebookEvent, NotebookEventInsert


def parse_notebook_event(record: Record) -> NotebookEvent:
    return NotebookEvent.parse_obj(record)


async def insert_notebook_event(
    connection: Connection, notebook_event: NotebookEventInsert
) -> NotebookEvent | None:
    record = await connection.fetchrow(
        """
        INSERT INTO public.notebook_event (notebook_id, event_date, creator_id, event, event_type)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, notebook_id, creation_date, event_date, creator_id, event, event_type
        """,
        notebook_event.notebook_id,
        notebook_event.event_date,
        notebook_event.creator_id,
        notebook_event.event,
        notebook_event.event_type,
    )

    if record:
        return parse_notebook_event(record)


async def get_notebook_event_by_id(
    connection: Connection, notebook_event_id: UUID
) -> NotebookEvent | None:
    record = await connection.fetchrow(
        """
        SELECT * from public.notebook_event WHERE id=$1
        """,
        notebook_event_id,
    )

    if record:
        return NotebookEvent.parse_obj(record)
