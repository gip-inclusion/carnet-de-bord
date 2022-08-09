from datetime import date
from typing import List
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.crud.notebook import add_wanted_jobs_to_notebook, parse_notebook_from_record
from api.db.models.beneficiary import Beneficiary
from api.db.models.notebook import Notebook


async def get_beneficiary_with_query(
    connection: Connection, query: str, *args
) -> Beneficiary | None:

    async with connection.transaction():

        beneficiary = None

        beneficiary_records: List[Record] = await connection.fetch(
            "SELECT public.beneficiary.*, public.account.id as account_id, "
            "public.wanted_job.rome_code_id, "
            "public.wanted_job.id as wanted_job_id, public.notebook.id as notebook_id, "
            "public.notebook.right_rsa, "
            "public.rome_code.code as rc_code, "
            "public.rome_code.description as rc_description, "
            "public.rome_code.label as rc_label "
            "FROM public.beneficiary "
            "LEFT JOIN public.notebook "
            "ON public.notebook.beneficiary_id = public.beneficiary.id "
            "LEFT JOIN public.wanted_job "
            "ON public.wanted_job.notebook_id = public.notebook.id "
            "LEFT JOIN public.rome_code "
            "ON public.rome_code.id = public.wanted_job.rome_code_id "
            "LEFT JOIN public.account "
            "ON public.account.beneficiary_id = public.beneficiary.id " + query,
            *args,
        )

        if len(beneficiary_records) > 0:

            for beneficiary_record in beneficiary_records:

                if beneficiary is None:
                    beneficiary = Beneficiary.parse_obj(beneficiary_record)

                if beneficiary_record["notebook_id"] is not None:
                    if beneficiary.notebook is None:
                        beneficiary.notebook = await parse_notebook_from_record(
                            beneficiary_record,
                            id_field="notebook_id",
                            beneficiary_id_field="id",
                            add_wanted_jobs=False,
                        )

                    await add_wanted_jobs_to_notebook(
                        beneficiary_record, beneficiary.notebook
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
