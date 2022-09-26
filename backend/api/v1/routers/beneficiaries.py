from fastapi import APIRouter, Depends, Request

from api.core.init import connection
from api.db.crud.beneficiary import insert_beneficiary
from api.db.models.beneficiary import BeneficiaryImport
from api.db.models.role import RoleEnum
from api.v1.dependencies import extract_deployment_id

router = APIRouter(dependencies=[Depends(extract_deployment_id)])


@router.post("/bulk")
async def tutu(
    beneficiaries: list[BeneficiaryImport],
    request: Request,
    db=Depends(connection),
):
    deployment_id = request.state.deployment_id
    async with db.transaction():
        [
            await insert_beneficiary(db, beneficiary, deployment_id)
            for beneficiary in beneficiaries
        ]
