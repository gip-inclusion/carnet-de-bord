import logging
from uuid import UUID

from asyncpg.connection import Connection
from fastapi import APIRouter, Depends, Request

from api.core.init import connection
from api.db.crud.beneficiary import (
    add_beneficiary_to_structure,
    get_beneficiaries_like,
    insert_beneficiary,
    update_beneficiary,
)
from api.db.crud.notebook import (
    create_new_notebook,
    insert_notebook_member,
    update_notebook,
)
from api.db.crud.professional import get_professional_by_email
from api.db.crud.structure import get_structure_by_name
from api.db.crud.wanted_job import insert_wanted_jobs
from api.db.models.beneficiary import BeneficiaryImport
from api.db.models.notebook_member import NotebookMemberInsert
from api.db.models.role import RoleEnum
from api.v1.dependencies import extract_deployment_id

router = APIRouter(dependencies=[Depends(extract_deployment_id)])
logger = logging.getLogger(__name__)


@router.post("/bulk")
async def import_beneficiaries(
    beneficiaries: list[BeneficiaryImport],
    request: Request,
    db=Depends(connection),
):
    deployment_id: UUID = UUID(request.state.deployment_id)
    [
        await import_beneficiary(db, beneficiary, deployment_id)
        for beneficiary in beneficiaries
    ]


async def import_beneficiary(
    db: Connection,
    beneficiary: BeneficiaryImport,
    deployment_id,
):
    async with db.transaction():
        existing_rows = await get_beneficiaries_like(db, beneficiary, deployment_id)
        match existing_rows:
            case []:
                b_id: UUID = await insert_beneficiary(db, beneficiary, deployment_id)
                nb_id: UUID = await create_new_notebook(db, b_id, beneficiary)
                await insert_wanted_jobs(db, nb_id, beneficiary)
                await insert_referent_and_structure(db, b_id, nb_id, beneficiary)
                logger.info("inserted new beneficiary %s", b_id)
            case [
                row
            ] if row.firstname == beneficiary.firstname and row.lastname == beneficiary.lastname and row.date_of_birth == beneficiary.date_of_birth and row.internal_id == beneficiary.si_id and row.deployment_id == deployment_id:
                record = await update_beneficiary(
                    db, beneficiary, deployment_id, existing_rows[0].id
                )
                await update_notebook(db, record["id"], beneficiary)
                logger.info("updated existing beneficiary %s", record["id"])
            case other:
                logger.info(
                    "block new beneficiary conflicting with existing beneficiaries: %s",
                    [beneficiary.id for beneficiary in existing_rows],
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

    if referent:
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
