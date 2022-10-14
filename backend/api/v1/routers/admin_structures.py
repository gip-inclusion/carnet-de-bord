import logging
from typing import Tuple
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException

from api.core.emails import send_invitation_email
from api.core.init import connection
from api.core.settings import settings
from api.db.crud.admin_structure import (
    create_admin_structure_with_account,
    get_admin_structure_by_email,
    insert_admin_structure_structure,
)
from api.db.models.account import AccountDB
from api.db.models.admin_structure import AdminStructure, AdminStructureStructureInput
from api.db.models.role import RoleEnum
from api.v1.dependencies import allowed_jwt_roles

logging.basicConfig(level=logging.INFO, format=settings.LOG_FORMAT)

admin_only = allowed_jwt_roles([RoleEnum.ADMIN_CDB, RoleEnum.ADMIN_STRUCTURE])

router = APIRouter(dependencies=[Depends(admin_only)])


@router.post("/create", response_model=AdminStructure)
async def create_admin_structure(
    data: AdminStructureStructureInput,
    background_tasks: BackgroundTasks,
    db=Depends(connection),
):
    async with db.transaction():
        admin_structure: AdminStructure | None = await get_admin_structure_by_email(
            db,
            data.admin.email,
        )
        if not admin_structure:

            account_admin_tuple: Tuple[
                AccountDB, AdminStructure
            ] | None = await create_admin_structure_with_account(db, data)

            if not account_admin_tuple:
                raise HTTPException(
                    status_code=500,
                    detail="insert admin_structure failed",
                )
            account, admin_structure = account_admin_tuple

            background_tasks.add_task(
                send_invitation_email,
                email=admin_structure.email,
                firstname=admin_structure.firstname,
                lastname=admin_structure.lastname,
                access_key=account.access_key,
            )

        ass_id: UUID | None = await insert_admin_structure_structure(
            connection=db,
            admin_structure_id=admin_structure.id,
            structure_id=data.structure_id,
        )

        if not ass_id:
            logging.error("Insert admin_structure_structure failed")
            raise HTTPException(
                status_code=500,
                detail="insert admin_structure_structure failed",
            )
        return admin_structure
