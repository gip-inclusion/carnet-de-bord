import json
import logging
from typing import Callable
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.account import AccountInfo
from api.db.models.action import Action
from api.db.models.appointment import Appointment
from api.db.models.beneficiary import BeneficiaryImport
from api.db.models.focus import Focus
from api.db.models.notebook import Notebook
from api.db.models.notebook_member import NotebookMember, NotebookMemberInsert
from api.db.models.rome_code import RomeCode
from api.db.models.target import Target
from api.db.models.wanted_job import WantedJob

logger = logging.getLogger(__name__)

NOTEBOOK_BASE_FIELDS = """
n.id as n_id,
n.beneficiary_id as n_beneficiary_id,
n.right_rsa as n_right_rsa,
n.right_rqth as n_right_rqth,
n.right_are as n_right_are,
n.right_ass as n_right_ass,
n.education_level as n_education_level,
n.work_situation_date as n_work_situation_date,
n.right_bonus as n_right_bonus,
n.geographical_area as n_geographical_area,
n.contract_type as n_contract_type,
n.contract_sign_date as n_contract_sign_date,
n.work_situation as n_work_situation,
n.work_situation_end_date as n_work_situation_end_date,
n.contract_start_date as n_contract_start_date,
n.contract_end_date as n_contract_end_date,
n.created_at as n_created_at,
n.updated_at as n_updated_at,
wj.rome_code_id as wj_rome_code_id,
wj.id as wj_id,
rc.code as rc_code,
rc.description as rc_description,
rc.label as rc_label,
nf.id as nf_id,
nf.theme as nf_theme,
nf.situations as nf_situations,
nf.creator_id as nf_creator_id,
nf.notebook_id as nf_notebook_id,
nf.created_at as nf_created_at,
nf.linked_to as nf_linked_to,
nf.updated_at as nf_updated_at,
nt.id as nt_id,
nt.focus_id as nt_focus_id,
nt.target as nt_target,
nt.created_at as nt_created_at,
nt.creator_id as nt_creator_id,
nt.updated_at as nt_updated_at,
nt.status as nt_status,
na.id as na_id,
na.action as na_action,
na.target_id as na_target_id,
na.status as na_status,
na.creator_id as na_creator_id,
na.created_at as na_created_at,
na.updated_at as na_updated_at,
na.initial_id as na_initial_id,
ai_action_creator.firstname as na_firstname,
ai_action_creator.lastname as na_lastname,
ai_action_creator.email as na_email,
nm.id as nm_id,
nm.notebook_id as nm_notebook_id,
nm.account_id as nm_account_id,
nm.last_visited_at as nm_last_visited_at,
nm.member_type as nm_member_type,
nm.last_modified_at as nm_last_modified_at,
nm.created_at as nm_created_at,
nm.creator_id as nm_creator_id,
nm.invitation_sent_at as nm_invitation_sent_at,
nm.active as nm_active,
nap.id as nap_id,
nap.notebook_id as nap_notebook_id,
nap.account_id as nap_account_id,
nap.date as nap_date,
nap.status as nap_status,
nap.created_at as nap_created_at,
nap.updated_at as nap_updated_at,
nap_account_info.firstname as nap_firstname,
nap_account_info.lastname as nap_lastname,
nap_account_info.email as nap_email
"""

NOTEBOOK_BASE_JOINS = """
LEFT JOIN wanted_job wj
ON wj.notebook_id = n.id
LEFT JOIN public.rome_code rc
ON rc.id = wj.rome_code_id
LEFT JOIN notebook_focus nf
ON nf.notebook_id = n.id
LEFT JOIN notebook_target nt
ON nt.focus_id = nf.id
LEFT JOIN notebook_action na
ON na.target_id = nt.id
LEFT JOIN notebook_member nm
ON nm.notebook_id = n.id
LEFT JOIN notebook_appointment nap
ON nap.notebook_id = n.id
LEFT JOIN account_info nap_account_info
ON nap.account_id = nap_account_info.account_id
LEFT JOIN account_info ai_action_creator
ON na.creator_id = ai_action_creator.account_id
"""

NOTEBOOK_BASE_QUERY = (
    "SELECT " + NOTEBOOK_BASE_FIELDS + "FROM public.notebook n" + NOTEBOOK_BASE_JOINS
)


async def add_wanted_jobs_to_notebook(
    record: Record,
    notebook: Notebook,
    notebook_record_prefix: str = "n_",
    wj_record_prefix: str = "wj_",
    rc_record_prefix: str = "rc_",
    notebook_id: str = "notebook_id",
) -> None:
    if record[wj_record_prefix + "rome_code_id"] is not None:
        rome_code = RomeCode(
            id=record[wj_record_prefix + "rome_code_id"],
            code=record[rc_record_prefix + "code"],
            label=record[rc_record_prefix + "label"],
            description=record[rc_record_prefix + "description"],
        )

        wanted_job = WantedJob(
            id=record[wj_record_prefix + "id"],
            notebook_id=record[notebook_record_prefix + notebook_id],
            rome_code_id=record[wj_record_prefix + "rome_code_id"],
            rome_code=rome_code,
        )

        existing_wanted_job: WantedJob | None = next(
            (
                wj
                for wj in notebook.wanted_jobs
                if wj.id == record[wj_record_prefix + "id"]
            ),
            None,
        )

        if not existing_wanted_job:
            notebook.wanted_jobs.append(wanted_job)


async def find_focus(
    notebook: Notebook, find_function: Callable[[Focus], bool]
) -> Focus | None:

    if notebook.focuses is not None:
        return next(
            (f for f in notebook.focuses if find_function(f)),
            None,
        )


async def find_target_from_focus(
    focus: Focus, find_function: Callable[[Target], bool]
) -> Target | None:

    if focus.targets is not None:
        return next(
            (t for t in focus.targets if find_function(t)),
            None,
        )


async def find_target_from_notebook(
    notebook: Notebook, focus_id: UUID, target_id: UUID
) -> Target | None:

    focus: Focus | None = await find_focus(notebook, lambda f: f.id == focus_id)

    if focus is None:
        return

    return await find_target_from_focus(focus, lambda t: t.id == target_id)


async def find_action_from_target(target: Target, action_id: UUID) -> Action | None:

    if target.actions is not None:
        return next(
            (a for a in target.actions if a.id == action_id),
            None,
        )


async def add_action_to_target(
    record: Record,
    notebook: Notebook,
    record_prefix: str = "na_",
    target_record_prefix: str = "nt_",
) -> None:

    if record[record_prefix + "id"] is None:
        return

    target: Target | None = await find_target_from_notebook(
        notebook,
        record[target_record_prefix + "focus_id"],
        record[target_record_prefix + "id"],
    )

    if not target:
        return

    action: Action | None = await find_action_from_target(
        target, record[record_prefix + "id"]
    )

    if action:
        return

    if target.actions is None:
        target.actions = []

    target.actions.append(
        Action(
            id=record[record_prefix + "id"],
            target_id=record[record_prefix + "target_id"],
            action=record[record_prefix + "action"],
            status=record[record_prefix + "status"],
            creator_id=record[record_prefix + "creator_id"],
            created_at=record[record_prefix + "created_at"],
            updated_at=record[record_prefix + "updated_at"],
            initial_id=record[record_prefix + "initial_id"],
            account_info=AccountInfo(
                account_id=record[record_prefix + "creator_id"],
                firstname=record[record_prefix + "firstname"],
                lastname=record[record_prefix + "lastname"],
                email=record[record_prefix + "email"],
            ),
        )
    )


async def add_target_to_focus(
    record: Record,
    notebook: Notebook,
    record_prefix: str = "nt_",
) -> None:

    if record[record_prefix + "id"] is not None:
        focus: Focus | None = await find_focus(
            notebook, lambda f: f.id == record[record_prefix + "focus_id"]
        )

        if focus:
            if focus.targets is None:
                focus.targets = []
            else:
                # Let's see if the target we want to add is already inserted
                target: Target | None = await find_target_from_focus(
                    focus, lambda t: t.id == record[record_prefix + "id"]
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


async def add_members_to_notebook(
    record: Record,
    notebook: Notebook,
    record_prefix: str = "nm_",
) -> None:
    if record[record_prefix + "id"] is not None:
        if notebook.members is None:
            notebook.members = []

        notebook_member: NotebookMember | None = next(
            (f for f in notebook.members if f.id == record[record_prefix + "id"]), None
        )

        # The current notebook_member is not already attached to the notebook
        # so let's add it
        if not notebook_member:

            notebook.members.append(
                NotebookMember(
                    id=record[record_prefix + "id"],
                    notebook_id=record[record_prefix + "notebook_id"],
                    account_id=record[record_prefix + "account_id"],
                    last_visited_at=record[record_prefix + "last_visited_at"],
                    member_type=record[record_prefix + "member_type"],
                    last_modified_at=record[record_prefix + "last_modified_at"],
                    invitation_sent_at=record[record_prefix + "invitation_sent_at"],
                    created_at=record[record_prefix + "created_at"],
                    creator_id=record[record_prefix + "creator_id"],
                    active=record[record_prefix + "active"],
                )
            )


async def add_appointments_to_notebook(
    record: Record,
    notebook: Notebook,
    record_prefix: str = "nap_",
) -> None:
    if record[record_prefix + "id"] is not None:
        if notebook.appointments is None:
            notebook.appointments = []

        appointment: Appointment | None = next(
            (f for f in notebook.appointments if f.id == record[record_prefix + "id"]),
            None,
        )

        # The current appointment is not already attached to the notebook
        # so let's add it
        if not appointment:

            notebook.appointments.append(
                Appointment(
                    id=record[record_prefix + "id"],
                    notebook_id=record[record_prefix + "notebook_id"],
                    account_info=AccountInfo(
                        account_id=record[record_prefix + "account_id"],
                        firstname=record[record_prefix + "firstname"],
                        lastname=record[record_prefix + "lastname"],
                        email=record[record_prefix + "email"],
                    ),
                    date=record[record_prefix + "date"],
                    status=record[record_prefix + "status"],
                    created_at=record[record_prefix + "created_at"],
                    updated_at=record[record_prefix + "created_at"],
                )
            )


async def parse_notebook_member_from_record(record: Record) -> NotebookMember:
    return NotebookMember.parse_obj(record)


async def parse_notebooks_from_records(
    records: list[Record],
    notebooks: list[Notebook],
    id_field: str = "n_id",
) -> list[Notebook]:

    for record in records:
        notebook: Notebook | None = next(
            (n for n in notebooks if n.id == record[id_field]), None
        )
        notebook_updated: Notebook | None = await parse_notebook_from_record(
            record, notebook=notebook
        )

        if not notebook:
            notebooks.append(notebook_updated)

    return notebooks


async def parse_notebook_from_record(
    record: Record,
    id_field: str = "id",
    record_prefix: str = "n_",
    beneficiary_id_field: str = "beneficiary_id",
    add_wanted_jobs: bool = True,
    add_focuses: bool = True,
    add_targets: bool = True,
    add_actions: bool = True,
    add_members: bool = True,
    add_appointments: bool = True,
    notebook: Notebook | None = None,
) -> Notebook:

    if not notebook:
        notebook = Notebook(
            id=record[record_prefix + id_field],
            created_at=record[record_prefix + "created_at"],
            updated_at=record[record_prefix + "updated_at"],
            right_rsa=record[record_prefix + "right_rsa"],
            right_rqth=record[record_prefix + "right_rqth"],
            right_are=record[record_prefix + "right_are"],
            right_ass=record[record_prefix + "right_ass"],
            right_bonus=record[record_prefix + "right_bonus"],
            beneficiary_id=record[record_prefix + beneficiary_id_field],
            wanted_jobs=[],
            geographical_area=record[record_prefix + "geographical_area"],
            education_level=record[record_prefix + "education_level"],
            work_situation_date=record[record_prefix + "work_situation_date"],
            contract_type=record[record_prefix + "contract_type"],
            contract_sign_date=record[record_prefix + "contract_sign_date"],
            work_situation=record[record_prefix + "work_situation"],
            work_situation_end_date=record[record_prefix + "work_situation_end_date"],
            contract_start_date=record[record_prefix + "contract_start_date"],
            contract_end_date=record[record_prefix + "contract_end_date"],
        )

    if add_wanted_jobs:
        await add_wanted_jobs_to_notebook(record, notebook, notebook_id=id_field)

    if add_focuses:
        await add_focus_to_notebook(record, notebook)

    if add_targets:
        await add_target_to_focus(record, notebook)

    if add_actions:
        await add_action_to_target(record, notebook)

    if add_members:
        await add_members_to_notebook(record, notebook)

    if add_appointments:
        await add_appointments_to_notebook(record, notebook)

    return notebook


async def get_notebook_member_with_query(
    connection: Connection, query: str, *args
) -> NotebookMember | None:
    async with connection.transaction():

        notebook_member_record: Record | None = await connection.fetchrow(
            "SELECT nm.* FROM public.notebook_member nm " + query,
            *args,
        )

        if notebook_member_record:
            return await parse_notebook_member_from_record(notebook_member_record)


async def get_notebook_members_with_query(
    connection: Connection, query: str, *args
) -> list[NotebookMember]:
    async with connection.transaction():

        records: list[Record] = await connection.fetch(
            "SELECT nm.* FROM public.notebook_member nm " + query,
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
        "WHERE nm.notebook_id = $1",
        notebook_id,
    )


async def get_notebook_member_by_notebook_id_and_account_id(
    connection: Connection, notebook_id: UUID, account_id: UUID
) -> NotebookMember | None:
    return await get_notebook_member_with_query(
        connection,
        """WHERE nm.notebook_id = $1
        AND nm.account_id = $2""",
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
        """LEFT JOIN account ON nm.account_id = account.id
        LEFT JOIN professional ON account.professional_id = professional.id
        WHERE professional.structure_id = $1""",
        structure_id,
    )


async def get_notebook_by_id(
    connection: Connection, notebook_id: UUID
) -> Notebook | None:
    return await get_notebook_with_query(
        connection,
        """WHERE n.id = $1""",
        notebook_id,
    )


async def insert_notebook(
    connection: Connection,
    beneficiary_id: UUID,
    beneficiary: BeneficiaryImport,
) -> UUID | None:

    INSERTABLE_VALUE = [
        "right_rsa",
        "right_rqth",
        "right_are",
        "right_ass",
        "right_bonus",
        "work_situation",
        "education_level",
        "geographical_area",
    ]

    fields_to_insert = [
        (fieldname, value)
        for (fieldname, value) in beneficiary.dict().items()
        if value is not None and fieldname in INSERTABLE_VALUE
    ]
    fields_to_insert.append(("beneficiary_id", beneficiary_id))

    sql_fields: list[str] = [key for (key, _) in fields_to_insert]
    sql_values: list[str] = [value for (_, value) in fields_to_insert]

    created_notebook: Record | None = await connection.fetchrow(
        f"""
INSERT INTO public.notebook (

    {", ".join(sql_fields)}
    )
VALUES (  {", ".join([f"${x+1}" for x in range(len(sql_fields))])})
returning id
        """,
        *sql_values,
    )

    if created_notebook:
        return created_notebook["id"]


async def update_notebook(
    connection: Connection,
    beneficiary_id: UUID,
    fields: list[tuple[str, str]],
) -> UUID | None:

    ALLOWED_FIELDS_UPDATE = [
        "right_rsa",
        "right_rqth",
        "right_are",
        "right_ass",
        "right_bonus",
        "work_situation",
        "education_level",
        "geographical_area",
    ]

    fields_to_update = [
        (key, value) for (key, value) in fields if key in ALLOWED_FIELDS_UPDATE
    ]

    if len(fields_to_update) == 0:
        logger.info("trying to udpate notebook but no fields where updated.")
        return None

    sql_fields: list[str] = [
        f"{key} = ${index+2}" for (index, (key, _)) in enumerate(fields_to_update)
    ]
    sql_values: list[str] = [value for (_, value) in fields_to_update]
    sql = f"""
            UPDATE notebook
                SET {", ".join(sql_fields)}
                WHERE beneficiary_id=$1
                returning id
        """
    result = await connection.fetchrow(sql, beneficiary_id, *sql_values)

    if result:
        return result["id"]
