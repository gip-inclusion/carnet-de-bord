import logging
from uuid import UUID

from asyncpg.connection import Connection

from cdb.api.db.crud.rome_code import get_rome_code_by_description_and_code
from cdb.api.db.models.beneficiary import Beneficiary, BeneficiaryImport
from cdb.api.db.models.notebook import Notebook
from cdb.api.db.models.professional_project import ProfessionalProject
from cdb.api.db.models.rome_code import RomeCode


async def find_professional_project_for_notebook(
    notebook: Notebook, rome_code_id: str, description: str
) -> ProfessionalProject | None:
    for professional_project in notebook.professional_projects:
        if (
            professional_project.rome_code.code == rome_code_id
            and professional_project.rome_code.description == description
        ):
            return professional_project


async def find_professional_project_for_beneficiary(
    beneficiary: Beneficiary, rome_code_id: str, description: str
) -> ProfessionalProject | None:
    if beneficiary.notebook is not None:
        return await find_professional_project_for_notebook(
            beneficiary.notebook, rome_code_id, description
        )


async def insert_professional_project_for_notebook(
    connection: Connection,
    notebook: Notebook,
    rome_code_id: str,
    description: str,
) -> ProfessionalProject | None:

    rome_code: RomeCode | None = await get_rome_code_by_description_and_code(
        connection, description, rome_code_id
    )

    if rome_code:
        record = await connection.fetchrow(
            """
            INSERT INTO public.professional_project (notebook_id, rome_code_id)
            VALUES ($1, $2)
            RETURNING id, notebook_id, rome_code_id
            """,
            notebook.id,
            rome_code.id,
        )
        if record:
            return ProfessionalProject(
                id=record["id"],
                notebook_id=notebook.id,
                rome_code_id=rome_code.id,
                rome_code=rome_code,
            )
    else:
        logging.error(
            f"Beneficiary {notebook.beneficiary_id} - "
            f"Rome code not found '({rome_code_id}) {description}'"
        )


async def insert_professional_projects(
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
INSERT INTO public.professional_project (notebook_id, rome_code_id)
VALUES ($1, $2)
ON CONFLICT do nothing
returning id
                    """,
                    notebook_id,
                    rome_code_id["id"],
                )
            else:
                logging.error(f"Notebook {notebook_id} - Rome code not found '({job}'")
