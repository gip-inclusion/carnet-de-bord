from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.notebook import NotebookMember, NotebookMemberInsert


async def parse_notebook_member_from_record(record: Record) -> NotebookMember:
    return NotebookMember.parse_obj(record)


async def get_notebook_member_with_query(
    connection: Connection, query: str, *args
) -> NotebookMember | None:
    async with connection.transaction():

        notebook_member_record: Record | None = await connection.fetchrow(
            "SELECT public.notebook_member.* " "FROM public.notebook_member " + query,
            *args,
        )

        if notebook_member_record:
            return await parse_notebook_member_from_record(notebook_member_record)


async def get_notebook_members_with_query(
    connection: Connection, query: str, *args
) -> list[NotebookMember]:
    async with connection.transaction():

        records: list[Record] = await connection.fetch(
            "SELECT public.notebook_member.* " "FROM public.notebook_member " + query,
            *args,
        )

        return [await parse_notebook_member_from_record(record) for record in records]


async def insert_notebook_member(
    connection: Connection, notebook_member_insert: NotebookMemberInsert
) -> NotebookMember | None:

    record = await connection.fetchrow(
        """
        INSERT INTO public.notebook_member (notebook_id, account_id, last_visited_at, member_type, last_modified_at, creator_id, invitation_sent_at, active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning id, notebook_id, account_id, last_visited_at, member_type, last_modified_at, created_at, creator_id, invitation_sent_at, active
        """,
        *notebook_member_insert.dict().values(),
    )

    if record:
        return await parse_notebook_member_from_record(record)


async def get_notebook_members_by_notebook_id(
    connection: Connection, notebook_id: UUID
) -> list[NotebookMember]:
    return await get_notebook_members_with_query(
        connection,
        "WHERE public.notebook_member.notebook_id = $1",
        notebook_id,
    )
