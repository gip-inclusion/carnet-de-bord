import logging
from typing import List

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.beneficiary import Beneficiary
from api.db.models.notebook import Notebook
from api.db.models.rome_code import RomeCode
from api.db.models.wanted_job import WantedJob
from cdb_csv.csv_row import PrincipalCsvRow


async def get_beneficiary_from_csv(
    connection: Connection, csv_row: PrincipalCsvRow
) -> Beneficiary | None:

    async with connection.transaction():

        beneficiary = None

        beneficiary_records: List[Record] = await connection.fetch(
            "SELECT public.beneficiary.*, public.account.id as account_id, "
            "public.wanted_job.rome_code_id, "
            "public.wanted_job.id as wanted_job_id, public.notebook.id as notebook_id, "
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
            "ON public.account.beneficiary_id = public.beneficiary.id "
            "WHERE LOWER(public.beneficiary.firstname) = LOWER($1) AND "
            "LOWER(public.beneficiary.lastname) = LOWER($2) AND "
            "public.beneficiary.date_of_birth = $3",
            csv_row.first_name,
            csv_row.last_name,
            csv_row.date_of_birth,
        )

        if len(beneficiary_records) > 0:

            for beneficiary_record in beneficiary_records:

                if beneficiary is None:
                    beneficiary = Beneficiary.parse_obj(beneficiary_record)

                if beneficiary_record["notebook_id"] is not None:
                    if beneficiary.notebook is None:
                        beneficiary.notebook = Notebook(
                            id=beneficiary_record["notebook_id"],
                            beneficiary_id=beneficiary_record["id"],
                            wanted_jobs=[],
                        )

                    if beneficiary_record["rome_code_id"] is not None:
                        rome_code = RomeCode(
                            id=beneficiary_record["rome_code_id"],
                            code=beneficiary_record["rc_code"],
                            label=beneficiary_record["rc_label"],
                            description=beneficiary_record["rc_description"],
                        )
                        beneficiary.notebook.wanted_jobs.append(
                            WantedJob(
                                id=beneficiary_record["wanted_job_id"],
                                notebook_id=beneficiary_record["notebook_id"],
                                rome_code_id=beneficiary_record["rome_code_id"],
                                rome_code=rome_code,
                            )
                        )

        return beneficiary
