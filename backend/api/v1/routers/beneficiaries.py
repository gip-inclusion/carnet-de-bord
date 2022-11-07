import logging
from uuid import UUID

from asyncpg.connection import Connection
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel

from api.core.exceptions import InsertFailError
from api.core.init import connection
from api.db.crud.beneficiary import (
    add_beneficiary_to_structure,
    get_beneficiaries_like,
    insert_beneficiary,
    update_beneficiary,
)
from api.db.crud.notebook import (
    insert_notebook,
    insert_notebook_member,
    update_notebook,
)
from api.db.crud.professional import get_professional_by_email
from api.db.crud.structure import get_structure_by_name
from api.db.crud.wanted_job import insert_wanted_jobs
from api.db.models.beneficiary import (
    Beneficiary,
    BeneficiaryCsvRowResponse,
    BeneficiaryImport,
    is_same_name,
)
from api.db.models.csv import CsvFieldError
from api.db.models.notebook_member import NotebookMemberInsert
from api.db.models.professional import Professional
from api.db.models.role import RoleEnum
from api.v1.dependencies import allowed_jwt_roles, extract_deployment_id

manager_only = allowed_jwt_roles([RoleEnum.MANAGER])
router = APIRouter(dependencies=[Depends(manager_only), Depends(extract_deployment_id)])
logger = logging.getLogger(__name__)


class BeneficiaryImportResult(BaseModel):
    beneficiary: UUID | None
    action: str
    error: str | None


class BeneficiariesImportResult(BaseModel):
    uuid: UUID
    result: list[BeneficiaryImportResult]


async def insert_referent_and_structure(
    db: Connection,
    beneficiary_id: UUID,
    notebook_id: UUID,
    beneficiary: BeneficiaryImport,
):
    structure = None
    if beneficiary.structure_name:
        structure = await get_structure_by_name(db, beneficiary.structure_name)
        if structure == None:
            # Si une structure est fournie dans l'import mais n'existe pas, on ne fait rien.
            logger.info(
                'Trying to associate structure with beneficiary: structure "%s" does not exist',
                beneficiary.structure_name,
            )
            return
    referent = None
    if beneficiary.advisor_email:
        referent: Professional | None = await get_professional_by_email(
            db, beneficiary.advisor_email.strip()
        )
    if structure:
        # Si on a pu récupérer la structure, on associe la structure au bénéficiaire.
        # Le status indique si la structure a déjà désigné un référent unique.
        if referent and referent.structure_id == structure.id:
            # Si on a structure ET un référent, le status est 'done'
            status = "done"
        else:
            # Sinon c'est 'pending'.
            status = "pending"
        await add_beneficiary_to_structure(db, beneficiary_id, structure.id, status)
    elif referent:
        # Si la structure n'est pas fournie dans l'import mais le référent est fourni,
        # Alors on ajout la structure du référent au bénéficiaire avec le status 'done'.
        await add_beneficiary_to_structure(
            db, beneficiary_id, referent.structure_id, "done"
        )

    if referent and referent.account_id:
        # Si on a pu récupérer le compte du référent fourni, on l'ajoute dans le
        # groupe de suivi en tant que référent.
        if not structure or structure.id == referent.structure_id:
            referent_member = NotebookMemberInsert(
                notebook_id=notebook_id,
                account_id=referent.account_id,
                member_type="referent",
            )
            await insert_notebook_member(db, referent_member)
    else:
        # Si un référent est fourni mais qu'on ne le connaît pas, on ne fait rien.
        logger.info(
            "trying to create referent: no account with email: %s",
            beneficiary.advisor_email,
        )


@router.post("/bulk", response_model=list[BeneficiaryCsvRowResponse])
async def import_beneficiaries(
    beneficiaries: list[BeneficiaryImport],
    request: Request,
    db=Depends(connection),
) -> list[BeneficiaryCsvRowResponse]:

    deployment_id: UUID = UUID(request.state.deployment_id)
    result = [
        await import_beneficiary(db, beneficiary, deployment_id)
        for beneficiary in beneficiaries
    ]
    return result


async def import_beneficiary(
    db: Connection,
    beneficiary: BeneficiaryImport,
    deployment_id,
) -> BeneficiaryCsvRowResponse:

    async with db.transaction():
        try:
            existing_rows: list[Beneficiary] = await get_beneficiaries_like(
                db, beneficiary, deployment_id
            )

            if len(existing_rows) == 0:
                beneficiary_id: UUID | None = await insert_beneficiary(
                    db, beneficiary, deployment_id
                )

                if not beneficiary_id:
                    raise InsertFailError("insert beneficiary failed")

                new_notebook_id: UUID | None = await insert_notebook(
                    db, beneficiary_id, beneficiary
                )

                if not new_notebook_id:
                    raise InsertFailError("insert notebook failed")

                await insert_wanted_jobs(db, new_notebook_id, beneficiary)
                await insert_referent_and_structure(
                    db, beneficiary_id, new_notebook_id, beneficiary
                )
                logger.info("inserted new beneficiary %s", beneficiary_id)

                return BeneficiaryCsvRowResponse(valid=True, data=beneficiary)

            if (
                len(existing_rows) == 1
                and is_same_name(
                    existing_rows[0].firstname,
                    beneficiary.firstname,
                    existing_rows[0].lastname,
                    beneficiary.lastname,
                )
                and existing_rows[0].date_of_birth == beneficiary.date_of_birth
                and existing_rows[0].internal_id == beneficiary.si_id
                and existing_rows[0].deployment_id == deployment_id
            ):
                beneficiary_id = await update_beneficiary(
                    db, beneficiary, deployment_id, existing_rows[0].id
                )
                notebook_id: UUID | None = await update_notebook(
                    db, beneficiary_id, beneficiary
                )
                if notebook_id:
                    await insert_wanted_jobs(db, notebook_id, beneficiary)
                logger.info("updated existing beneficiary %s", beneficiary_id)

                return BeneficiaryCsvRowResponse(valid=True, data=beneficiary)

            logger.info(
                "block new beneficiary conflicting with existing beneficiaries: %s",
                [beneficiary.id for beneficiary in existing_rows],
            )

            return BeneficiaryCsvRowResponse(
                row=beneficiary.dict(),
                errors=[
                    CsvFieldError(
                        error="Un bénéficiaire existant utilise cet internalId ou ce nom/prénom/date de naissance sur le territoire."
                    )
                ],
                valid=False,
            )

        except InsertFailError as error:
            logging.error(error)
            return BeneficiaryCsvRowResponse(
                row=beneficiary.dict(),
                errors=[
                    CsvFieldError(
                        error=f"import beneficiary {beneficiary.si_id}: {error}"
                    )
                ],
                valid=False,
            )
        except Exception as error:
            logging.error("unhandled exception %s", error)
            return BeneficiaryCsvRowResponse(
                row=beneficiary.dict(),
                errors=[
                    CsvFieldError(
                        error=f"import structure {beneficiary.si_id}: erreur inconnue"
                    )
                ],
                valid=False,
            )
