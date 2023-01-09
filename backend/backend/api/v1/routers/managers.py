import logging

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException

from backend.api.core.emails import send_invitation_email
from backend.api.core.init import connection
from backend.api.db.crud.account import (
    create_username,
    get_accounts_with_query,
    insert_admin_pdi_account,
)
from backend.api.db.crud.manager import insert_admin_pdi
from backend.api.db.models.account import AccountDBWithAccessKey
from backend.api.db.models.manager import Manager, ManagerInput
from backend.api.db.models.role import RoleEnum
from backend.api.v1.dependencies import allowed_jwt_roles

admin_cdb_only = allowed_jwt_roles([RoleEnum.ADMIN_CDB])

router = APIRouter(dependencies=[Depends(admin_cdb_only)])


@router.post("/create", response_model=Manager)
async def create_manager(
    admin: ManagerInput,
    background_tasks: BackgroundTasks,
    db=Depends(connection),
):
    async with db.transaction():
        admin_pdi = await insert_admin_pdi(connection=db, data=admin)
        if admin_pdi is None:
            raise HTTPException(status_code=500, detail="insert manager failed")

        email_username = admin.email.split("@")[0].lower()

        accounts = await get_accounts_with_query(
            db,
            """
            WHERE account.username like $1
            """,
            email_username + "%",
        )

        username = create_username(
            email_username, [account.username for account in accounts]
        )

        account: AccountDBWithAccessKey | None = await insert_admin_pdi_account(
            connection=db,
            admin_pdi_id=admin_pdi.id,
            confirmed=True,
            username=username,
        )

        if not account:
            logging.error("Insert account failed")
            raise HTTPException(status_code=500, detail="insert account failed")

        background_tasks.add_task(
            send_invitation_email,
            email=admin_pdi.email,
            firstname=admin_pdi.firstname,
            lastname=admin_pdi.lastname,
            access_key=account.access_key,
        )
        return admin_pdi
