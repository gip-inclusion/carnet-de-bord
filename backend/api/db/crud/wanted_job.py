import logging
from uuid import UUID

from asyncpg.connection import Connection

from api.db.crud.rome_code import get_rome_code_by_description_and_code
from api.db.models.beneficiary import Beneficiary, BeneficiaryImport
from api.db.models.notebook import Notebook
from api.db.models.rome_code import RomeCode
from api.db.models.wanted_job import WantedJob


async def find_wanted_job_for_notebook(
    notebook: Notebook, rome_code_id: str, description: str
) -> WantedJob | None:
    for wanted_job in notebook.wanted_jobs:
        if (
            wanted_job.rome_code.code == rome_code_id
            and wanted_job.rome_code.description == description
        ):
            return wanted_job


async def find_wanted_job_for_beneficiary(
    beneficiary: Beneficiary, rome_code_id: str, description: str
) -> WantedJob | None:
    if beneficiary.notebook is not None:
        return await find_wanted_job_for_notebook(
            beneficiary.notebook, rome_code_id, description
        )


async def insert_wanted_job_for_notebook(
    connection: Connection,
    notebook: Notebook,
    rome_code_id: str,
    description: str,
) -> WantedJob | None:

    rome_code: RomeCode | None = await get_rome_code_by_description_and_code(
        connection, description, rome_code_id
    )

    if rome_code:
        record = await connection.fetchrow(
            """
            INSERT INTO public.wanted_job (notebook_id, rome_code_id)
            VALUES ($1, $2)
            RETURNING id, notebook_id, rome_code_id
            """,
            notebook.id,
            rome_code.id,
        )
        if record:
            return WantedJob(
                id=record["id"],
                notebook_id=notebook.id,
                rome_code_id=rome_code.id,
                rome_code=rome_code,
            )
    else:
        logging.error(
            f"Beneficiary {notebook.beneficiary_id} - Rome code not found '({rome_code_id}) {description}'"
        )


async def insert_wanted_jobs(
    db: Connection,
    notebook_id: UUID,
    beneficiary: BeneficiaryImport,
):
    if beneficiary.rome_code_description:
        for job in beneficiary.rome_code_description.split(","):

            rome_code_id: UUID = await db.fetchrow(
                """
SELECT id from public.rome_code where label = $1
                """,
                job.strip(),
            )
            if rome_code_id:
                await db.fetch(
                    """
INSERT INTO public.wanted_job (notebook_id, rome_code_id)
VALUES ($1, $2)
returning id
                    """,
                    notebook_id,
                    rome_code_id["id"],
                )
