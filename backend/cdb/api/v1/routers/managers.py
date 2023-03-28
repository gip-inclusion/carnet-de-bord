from typing import Tuple

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException

from cdb.api.core.emails import send_invitation_email
from cdb.api.core.init import connection
from cdb.api.db.crud.manager import insert_manager_with_account
from cdb.api.db.models.account import AccountDBWithAccessKey
from cdb.api.db.models.manager import Manager, ManagerInput
from cdb.api.db.models.role import RoleEnum
from cdb.api.v1.dependencies import allowed_jwt_roles

admin_cdb_only = allowed_jwt_roles([RoleEnum.ADMIN_CDB])

router = APIRouter(dependencies=[Depends(admin_cdb_only)])


@router.post("/create", response_model=Manager)
async def create_manager(
    admin: ManagerInput,
    background_tasks: BackgroundTasks,
    db=Depends(connection),
):
    account_manager_tuple: Tuple[
        AccountDBWithAccessKey, Manager
    ] | None = await insert_manager_with_account(connection=db, data=admin)

    if account_manager_tuple is None:
        raise HTTPException(status_code=500, detail="insert manager failed")

    account, manager = account_manager_tuple

    background_tasks.add_task(
        send_invitation_email,
        email=manager.email,
        firstname=manager.firstname,
        lastname=manager.lastname,
        access_key=account.access_key,
    )
    return manager
