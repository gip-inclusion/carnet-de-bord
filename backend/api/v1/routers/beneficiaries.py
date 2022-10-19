import logging
from uuid import UUID, uuid4

from asyncpg.connection import Connection
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel

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
from api.db.models.beneficiary import BeneficiaryImport
from api.db.models.notebook_member import NotebookMemberInsert
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


@router.post("/bulk")
async def import_beneficiaries(
    beneficiaries: list[BeneficiaryImport],
    request: Request,
    db=Depends(connection),
) -> BeneficiariesImportResult:
    import_uuid: UUID = uuid4()
    deployment_id: UUID = UUID(request.state.deployment_id)
    result = [
        await import_beneficiary(db, beneficiary, deployment_id)
        for beneficiary in beneficiaries
    ]
    return BeneficiariesImportResult(
        uuid=import_uuid,
        result=result,
    )


async def import_beneficiary(
    db: Connection,
    beneficiary: BeneficiaryImport,
    deployment_id,
) -> BeneficiaryImportResult:
    async with db.transaction():
        try:
            existing_rows = await get_beneficiaries_like(db, beneficiary, deployment_id)
            match existing_rows:
                case []:
                    b_id: UUID = await insert_beneficiary(
                        db, beneficiary, deployment_id
                    )
                    nb_id: UUID = await insert_notebook(db, b_id, beneficiary)
                    await insert_wanted_jobs(db, nb_id, beneficiary)
                    await insert_referent_and_structure(db, b_id, nb_id, beneficiary)
                    logger.info("inserted new beneficiary %s", b_id)
                    return BeneficiaryImportResult(
                        beneficiary=b_id,
                        action="Creation",
                        error=None,
                    )
                case [
                    row
                ] if row.firstname == beneficiary.firstname and row.lastname == beneficiary.lastname and row.date_of_birth == beneficiary.date_of_birth and row.internal_id == beneficiary.si_id and row.deployment_id == deployment_id:
                    b_id = await update_beneficiary(
                        db, beneficiary, deployment_id, existing_rows[0].id
                    )
                    nb_id: UUID | None = await update_notebook(db, b_id, beneficiary)
                    if nb_id:
                        await insert_wanted_jobs(db, nb_id, beneficiary)
                    logger.info("updated existing beneficiary %s", b_id)
                    return BeneficiaryImportResult(
                        beneficiary=b_id,
                        action="Update",
                        error=None,
                    )
                case other:
                    logger.info(
                        "block new beneficiary conflicting with existing beneficiaries: %s",
                        [beneficiary.id for beneficiary in existing_rows],
                    )
                    return BeneficiaryImportResult(
                        beneficiary=None,
                        action="No action",
                        error="Un bénéficiaire existant utilise cet internalId ou ce nom/prénom/date de naissance sur le territoire.",
                    )

        except Exception:
            return BeneficiaryImportResult(
                beneficiary=None,
                action="No action",
                error="An internal error occured while processing this beneficiary",
            )


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
        if referent and referent.structure_id == structure.id:
            status = "done"
        else:
            status = "pending"
        await add_beneficiary_to_structure(db, beneficiary_id, structure.id, status)
    elif referent:
        await add_beneficiary_to_structure(
            db, beneficiary_id, referent.structure_id, "done"
        )

    if referent and referent.account_id:
        if not structure or structure.id == referent.structure_id:
            referent = NotebookMemberInsert(
                notebook_id=notebook_id,
                account_id=referent.account_id,
                member_type="referent",
            )
            await insert_notebook_member(db, referent)
    else:
        logger.info(
            "trying to create referent: no account with email: %s",
            beneficiary.advisor_email,
        )
