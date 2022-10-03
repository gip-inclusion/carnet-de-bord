import logging
from uuid import UUID

from asyncpg.connection import Connection
from fastapi import APIRouter, Depends, Request

from api.core.init import connection
from api.db.crud.beneficiary import (
    get_beneficiaries_like,
    insert_beneficiary,
    update_beneficiary,
)
from api.db.crud.notebook import create_new_notebook
from api.db.models.beneficiary import BeneficiaryImport
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
    print(beneficiary)
    async with db.transaction():
        existing_rows = await get_beneficiaries_like(db, beneficiary, deployment_id)
        match existing_rows:
            case []:
                record = await insert_beneficiary(db, beneficiary, deployment_id)
                logger.info("inserted new beneficiary %s", record["id"])
                await create_new_notebook(db, record["id"], beneficiary)
            case [
                row
            ] if row.firstname == beneficiary.firstname and row.lastname == beneficiary.lastname and row.date_of_birth == beneficiary.date_of_birth and row.internal_id == beneficiary.si_id and row.deployment_id == deployment_id:
                record = await update_beneficiary(
                    db, beneficiary, deployment_id, existing_rows[0].id
                )
                logger.info("updated existing beneficiary %s", record["id"])
            case other:
                logger.info(
                    "block new beneficiary conflicting with existing beneficiaries: %s",
                    [beneficiary.id for beneficiary in existing_rows],
                )
