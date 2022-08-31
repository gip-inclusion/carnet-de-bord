import logging
import uuid
from http.client import HTTPException

from fastapi import APIRouter, BackgroundTasks, Depends

from api.core.emails import generic_account_creation_email
from api.core.init import connection
from api.core.settings import settings
from api.db.crud.account import insert_admin_structure_account
from api.db.crud.admin_structure import (
    insert_admin_structure,
    insert_admin_structure_structure,
)
from api.db.models.admin_structure import AdminStructure, AdminStructureStructureInput
from api.db.models.role import RoleEnum
from api.sendmail import send_mail
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
        admin_structure = await insert_admin_structure(connection=db, data=data.admin)
        if admin_structure is None:
            raise HTTPException(status_code=500, detail="insert admin_structure failed")

        account = await insert_admin_structure_account(
            connection=db,
            admin_structure_id=admin_structure.id,
            confirmed=True,
            username=str(uuid.uuid4()),
        )

        if not account:
            logging.error(f"Insert account failed")
            raise HTTPException(status_code=500, detail="insert account failed")

        ass_id = await insert_admin_structure_structure(
            connection=db,
            admin_structure_id=admin_structure.id,
            structure_id=data.structure_id,
        )

        if not ass_id:
            logging.error(f"Insert admin_structure_structure failed")
            raise HTTPException(
                status_code=500,
                detail="insert admin_structure_structure failed",
            )

        background_tasks.add_task(
            send_invitation_email,
            email=admin_structure.email,
            firstname=admin_structure.firstname,
            lastname=admin_structure.lastname,
            access_key=account.access_key,
        )

        return admin_structure


def send_invitation_email(
    email: str, firstname: str | None, lastname: str | None, access_key: uuid.UUID
) -> None:
    message = generic_account_creation_email(email, firstname, lastname, access_key)
    send_mail(email, "Création de compte sur Carnet de bord", message)
