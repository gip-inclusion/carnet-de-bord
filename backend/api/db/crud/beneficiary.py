from datetime import date
from typing import List
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.crud.notebook import add_wanted_jobs_to_notebook, parse_notebook_from_record
from api.db.models.beneficiary import Beneficiary


async def get_beneficiary_with_query(
    connection: Connection, query: str, *args
) -> Beneficiary | None:

    async with connection.transaction():

        beneficiary = None

        beneficiary_records: List[Record] = await connection.fetch(
            "SELECT public.beneficiary.*, public.account.id as account_id, "
            "public.wanted_job.rome_code_id, "
            "public.wanted_job.id as wanted_job_id, public.notebook.id as notebook_id, "
            "public.notebook.right_rsa, public.notebook.right_rqth, "
            "public.notebook.right_are, public.notebook.right_ass, "
            "public.notebook.right_bonus, public.notebook.geographical_area, "
            "public.notebook.education_level, public.notebook.work_situation_date, "
            "public.notebook.contract_type, public.notebook.contract_sign_date, "
            "public.notebook.work_situation, public.notebook.work_situation_end_date, "
            "public.notebook.contract_start_date, public.notebook.contract_end_date, "
            "public.rome_code.code as rc_code, "
            "public.rome_code.description as rc_description, "
            "public.rome_code.label as rc_label, "
            "notebook_focus.id as nf_id,"
            "notebook_focus.theme as nf_theme,"
            "notebook_focus.situations as nf_situations,"
            "notebook_focus.creator_id as nf_creator_id,"
            "notebook_focus.notebook_id as nf_notebook_id,"
            "notebook_focus.created_at as nf_created_at,"
            "notebook_focus.linked_to as nf_linked_to,"
            "notebook_focus.updated_at as nf_updated_at,"
            "notebook_target.id as nt_id,"
            "notebook_target.focus_id as nt_focus_id,"
            "notebook_target.target as nt_target,"
            "notebook_target.created_at as nt_created_at,"
            "notebook_target.creator_id as nt_creator_id,"
            "notebook_target.updated_at as nt_updated_at,"
            "notebook_target.status as nt_status,"
            "notebook_action.id as na_id,"
            "notebook_action.action as na_action,"
            "notebook_action.target_id as na_target_id,"
            "notebook_action.status as na_status,"
            "notebook_action.creator_id as na_creator_id,"
            "notebook_action.created_at as na_created_at,"
            "notebook_action.updated_at as na_updated_at,"
            "notebook_action.initial_id as na_initial_id "
            "FROM public.beneficiary "
            "LEFT JOIN public.notebook "
            "ON public.notebook.beneficiary_id = public.beneficiary.id "
            "LEFT JOIN public.wanted_job "
            "ON public.wanted_job.notebook_id = public.notebook.id "
            "LEFT JOIN public.rome_code "
            "ON public.rome_code.id = public.wanted_job.rome_code_id "
            "LEFT JOIN notebook_focus "
            "ON public.notebook_focus.notebook_id = public.notebook.id "
            "LEFT JOIN notebook_target "
            "ON public.notebook_target.focus_id = public.notebook_focus.id "
            "LEFT JOIN notebook_action "
            "ON public.notebook_action.target_id = public.notebook_target.id "
            "LEFT JOIN public.account "
            "ON public.account.beneficiary_id = public.beneficiary.id " + query,
            *args,
        )

        for beneficiary_record in beneficiary_records:

            if beneficiary is None:
                beneficiary = Beneficiary.parse_obj(beneficiary_record)

            if beneficiary_record["notebook_id"] is not None:
                beneficiary.notebook = await parse_notebook_from_record(
                    beneficiary_record,
                    id_field="notebook_id",
                    beneficiary_id_field="id",
                    notebook=beneficiary.notebook,
                )

        return beneficiary


async def get_beneficiary_from_personal_information(
    connection: Connection, firstname: str, lastname: str, birth_date: date
) -> Beneficiary | None:

    return await get_beneficiary_with_query(
        connection,
        # We use LOWER(BTRIM(field)) here to match the index so postgres
        # can use the index rather than scanning the whole table
        "WHERE LOWER(BTRIM(public.beneficiary.firstname)) = LOWER($1) AND "
        "LOWER(BTRIM(public.beneficiary.lastname)) = LOWER($2) AND "
        "public.beneficiary.date_of_birth = $3",
        firstname,
        lastname,
        birth_date,
    )


async def get_beneficiary_by_id(
    connection: Connection, beneficiary_id: UUID
) -> Beneficiary | None:

    return await get_beneficiary_with_query(
        connection, "WHERE public.beneficiary.id = $1", beneficiary_id
    )
