from asyncpg.connection import Connection

from api.db.crud.beneficiary import get_beneficiary_by_id
from api.db.models.notebook import Notebook
from api.db.models.out import BeneficiaryOut, NotebookOut, RomeCodeOut, WantedJobOut


async def notebook_to_out(
    connection: Connection, notebook: Notebook
) -> NotebookOut | None:
    # @TODO: Make the join before and populate it to the Notebook instance
    beneficiary = await get_beneficiary_by_id(connection, notebook.beneficiary_id)
    if beneficiary:
        beneficiary_out = BeneficiaryOut(
            email=beneficiary.email,
            lastname=beneficiary.lastname,
            firstname=beneficiary.firstname,
            caf_number=beneficiary.caf_number,
            pe_number=beneficiary.pe_number,
            postal_code=beneficiary.postal_code,
            city=beneficiary.city,
            address1=beneficiary.address1,
            address2=beneficiary.address2,
            mobile_number=beneficiary.mobile_number,
            date_of_birth=beneficiary.date_of_birth,
            place_of_birth=beneficiary.place_of_birth,
            created_at=beneficiary.created_at,
            updated_at=beneficiary.updated_at,
        )

        notebook_out = NotebookOut(
            beneficiary=beneficiary_out,
            wanted_jobs=[
                WantedJobOut(
                    rome_code=RomeCodeOut(
                        code=j.rome_code.code,
                        description=j.rome_code.description,
                        label=j.rome_code.label,
                    )
                )
                for j in notebook.wanted_jobs
            ],
        )

        return notebook_out
