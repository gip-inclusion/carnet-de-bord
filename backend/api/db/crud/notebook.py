from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.notebook import Notebook, NotebookMember, NotebookMemberInsert
from api.db.models.rome_code import RomeCode
from api.db.models.wanted_job import WantedJob


async def add_wanted_jobs_to_notebook(
    record: Record,
    notebook: Notebook,
    record_prefix: str = "",
    notebook_id: str = "notebook_id",
) -> Notebook | None:
    if record[record_prefix + "rome_code_id"] is not None:
        rome_code = RomeCode(
            id=record[record_prefix + "rome_code_id"],
            code=record[record_prefix + "rc_code"],
            label=record[record_prefix + "rc_label"],
            description=record[record_prefix + "rc_description"],
        )
        notebook.wanted_jobs.append(
            WantedJob(
                id=record[record_prefix + "wanted_job_id"],
                notebook_id=record[record_prefix + notebook_id],
                rome_code_id=record[record_prefix + "rome_code_id"],
                rome_code=rome_code,
            )
        )


async def parse_notebook_member_from_record(record: Record) -> NotebookMember:
    return NotebookMember.parse_obj(record)


async def parse_notebook_from_record(
    record: Record,
    id_field: str = "id",
    beneficiary_id_field: str = "beneficiary_id",
    add_wanted_jobs: bool = True,
) -> Notebook:
    notebook = Notebook(
        id=record[id_field],
        created_at=record["created_at"],
        right_rsa=record["right_rsa"],
        beneficiary_id=record[beneficiary_id_field],
        wanted_jobs=[],
    )

    if add_wanted_jobs:
        await add_wanted_jobs_to_notebook(record, notebook, notebook_id=id_field)

    return notebook


async def get_notebook_member_with_query(
    connection: Connection, query: str, *args
) -> NotebookMember | None:
    async with connection.transaction():

        notebook_member_record: Record | None = await connection.fetchrow(
            "SELECT public.notebook_member.* FROM public.notebook_member " + query,
            *args,
        )

        if notebook_member_record:
            return await parse_notebook_member_from_record(notebook_member_record)


async def get_notebook_members_with_query(
    connection: Connection, query: str, *args
) -> list[NotebookMember]:
    async with connection.transaction():

        records: list[Record] = await connection.fetch(
            "SELECT public.notebook_member.* FROM public.notebook_member " + query,
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


async def get_notebook_member_by_notebook_id_and_account_id(
    connection: Connection, notebook_id: UUID, account_id: UUID
) -> NotebookMember | None:
    return await get_notebook_member_with_query(
        connection,
        """WHERE public.notebook_member.notebook_id = $1
        AND public.notebook_member.account_id = $2""",
        notebook_id,
        account_id,
    )


async def get_notebooks_with_query(
    connection: Connection, query: str, *args
) -> list[Notebook]:
    async with connection.transaction():

        records: list[Record] = await connection.fetch(
            """SELECT public.notebook.*,
            wanted_job.rome_code_id,
            wanted_job.id as wanted_job_id,
            rome_code.code as rc_code,
            rome_code.description as rc_description,
            rome_code.label as rc_label
            FROM public.notebook
            LEFT JOIN wanted_job
            ON public.wanted_job.notebook_id = public.notebook.id
            LEFT JOIN public.rome_code
            ON public.rome_code.id = public.wanted_job.rome_code_id
             """
            + query,
            *args,
        )

        return [await parse_notebook_from_record(record) for record in records]


async def get_notebooks_by_structure_id(
    connection: Connection, structure_id: UUID
) -> list[Notebook]:
    return await get_notebooks_with_query(
        connection,
        """LEFT JOIN notebook_member ON notebook_member.notebook_id = notebook.id
        LEFT JOIN account ON notebook_member.account_id = account.id
        LEFT JOIN professional ON account.professional_id = professional.id
        WHERE professional.structure_id = $1""",
        structure_id,
    )
