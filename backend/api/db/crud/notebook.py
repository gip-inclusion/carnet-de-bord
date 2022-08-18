import json
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.focus import Focus
from api.db.models.notebook import Notebook, NotebookMember, NotebookMemberInsert
from api.db.models.rome_code import RomeCode
from api.db.models.target import Target
from api.db.models.wanted_job import WantedJob

NOTEBOOK_BASE_QUERY = """
SELECT public.notebook.*,
       wanted_job.rome_code_id,
       wanted_job.id as wanted_job_id,
       rome_code.code as rc_code,
       rome_code.description as rc_description,
       rome_code.label as rc_label,
       notebook_focus.id as nf_id,
       notebook_focus.theme as nf_theme,
       notebook_focus.situations as nf_situations,
       notebook_focus.creator_id as nf_creator_id,
       notebook_focus.notebook_id as nf_notebook_id,
       notebook_focus.created_at as nf_created_at,
       notebook_focus.linked_to as nf_linked_to,
       notebook_focus.updated_at as nf_updated_at,
       notebook_target.id as nt_id,
       notebook_target.focus_id as nt_focus_id,
       notebook_target.target as nt_target,
       notebook_target.created_at as nt_created_at,
       notebook_target.creator_id as nt_creator_id,
       notebook_target.updated_at as nt_updated_at,
       notebook_target.status as nt_status
FROM public.notebook
LEFT JOIN wanted_job
ON public.wanted_job.notebook_id = public.notebook.id
LEFT JOIN notebook_focus
ON public.notebook_focus.notebook_id = public.notebook.id
LEFT JOIN notebook_target
ON public.notebook_target.focus_id = public.notebook_focus.id
LEFT JOIN public.rome_code
ON public.rome_code.id = public.wanted_job.rome_code_id
"""


async def add_wanted_jobs_to_notebook(
    record: Record,
    notebook: Notebook,
    record_prefix: str = "",
    notebook_id: str = "notebook_id",
) -> None:
    if record[record_prefix + "rome_code_id"] is not None:
        rome_code = RomeCode(
            id=record[record_prefix + "rome_code_id"],
            code=record[record_prefix + "rc_code"],
            label=record[record_prefix + "rc_label"],
            description=record[record_prefix + "rc_description"],
        )

        wanted_job = WantedJob(
            id=record[record_prefix + "wanted_job_id"],
            notebook_id=record[record_prefix + notebook_id],
            rome_code_id=record[record_prefix + "rome_code_id"],
            rome_code=rome_code,
        )

        existing_wanted_job: WantedJob | None = next(
            (
                wj
                for wj in notebook.wanted_jobs
                if wj.id == record[record_prefix + "wanted_job_id"]
            ),
            None,
        )

        if not existing_wanted_job:
            notebook.wanted_jobs.append(wanted_job)


async def add_target_to_focus(
    record: Record,
    notebook: Notebook,
    record_prefix: str = "nt_",
) -> None:

    if record[record_prefix + "id"] is not None and notebook.focuses is not None:
        focus: Focus | None = next(
            (f for f in notebook.focuses if f.id == record[record_prefix + "focus_id"]),
            None,
        )

        if focus:
            if focus.targets is None:
                focus.targets = []
            else:
                # Let's see if the target we want to add is already inserted
                target: Target | None = next(
                    (t for t in focus.targets if t.id == record[record_prefix + "id"]),
                    None,
                )

                if target:
                    return
                else:
                    focus.targets.append(
                        Target(
                            id=record[record_prefix + "id"],
                            focus_id=record[record_prefix + "focus_id"],
                            target=record[record_prefix + "target"],
                            creator_id=record[record_prefix + "creator_id"],
                            created_at=record[record_prefix + "created_at"],
                            updated_at=record[record_prefix + "updated_at"],
                            status=record[record_prefix + "status"],
                        )
                    )

            pass


async def add_focus_to_notebook(
    record: Record,
    notebook: Notebook,
    record_prefix: str = "nf_",
) -> None:
    if record[record_prefix + "id"] is not None:
        if notebook.focuses is None:
            notebook.focuses = []

        focus: Focus | None = next(
            (f for f in notebook.focuses if f.id == record[record_prefix + "id"]), None
        )

        # The current focus is not already attached to the notebook
        # so let's add it
        if not focus:
            notebook.focuses.append(
                Focus(
                    id=record[record_prefix + "id"],
                    theme=record[record_prefix + "theme"],
                    situations=json.loads(record[record_prefix + "situations"]),
                    creator_id=record[record_prefix + "creator_id"],
                    notebook_id=record[record_prefix + "notebook_id"],
                    created_at=record[record_prefix + "created_at"],
                    updated_at=record[record_prefix + "updated_at"],
                    linked_to=record[record_prefix + "linked_to"],
                )
            )


async def parse_notebook_member_from_record(record: Record) -> NotebookMember:
    return NotebookMember.parse_obj(record)


async def parse_notebooks_from_records(
    records: list[Record],
    notebooks: list[Notebook],
    id_field: str = "id",
) -> list[Notebook]:

    for record in records:
        notebook: Notebook | None = next(
            (n for n in notebooks if n.id == record[id_field]), None
        )

        await parse_notebook_from_record(record, notebook=notebook)

    return notebooks


async def parse_notebook_from_record(
    record: Record,
    id_field: str = "id",
    beneficiary_id_field: str = "beneficiary_id",
    add_wanted_jobs: bool = True,
    add_focus: bool = True,
    add_target: bool = True,
    notebook: Notebook | None = None,
) -> Notebook:

    if not notebook:
        notebook = Notebook(
            id=record[id_field],
            created_at=record["created_at"],
            updated_at=record["updated_at"],
            right_rsa=record["right_rsa"],
            right_rqth=record["right_rqth"],
            right_are=record["right_are"],
            right_ass=record["right_ass"],
            right_bonus=record["right_bonus"],
            beneficiary_id=record[beneficiary_id_field],
            wanted_jobs=[],
            geographical_area=record["geographical_area"],
            education_level=record["education_level"],
            work_situation_date=record["work_situation_date"],
            contract_type=record["contract_type"],
            contract_sign_date=record["contract_sign_date"],
            work_situation=record["work_situation"],
            work_situation_end_date=record["work_situation_end_date"],
            contract_start_date=record["contract_start_date"],
            contract_end_date=record["contract_end_date"],
        )

    if add_wanted_jobs:
        await add_wanted_jobs_to_notebook(record, notebook, notebook_id=id_field)

    if add_focus:
        await add_focus_to_notebook(record, notebook)

    if add_target:
        await add_target_to_focus(record, notebook)

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
            NOTEBOOK_BASE_QUERY + query,
            *args,
        )

        notebooks: list[Notebook] = []
        return await parse_notebooks_from_records(records=records, notebooks=notebooks)


async def get_notebook_with_query(
    connection: Connection, query: str, *args
) -> Notebook | None:
    async with connection.transaction():

        record: Record = await connection.fetchrow(
            NOTEBOOK_BASE_QUERY + query,
            *args,
        )

        return await parse_notebook_from_record(record)


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


async def get_notebook_by_id(
    connection: Connection, notebook_id: UUID
) -> Notebook | None:
    return await get_notebook_with_query(
        connection,
        """WHERE public.notebook.id = $1""",
        notebook_id,
    )
