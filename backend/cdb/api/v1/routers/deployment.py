from typing import Tuple

from asyncpg.exceptions import UniqueViolationError
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException

from cdb.api.core.emails import send_invitation_email
from cdb.api.core.init import connection
from cdb.api.db.crud.deployment import insert_deployment
from cdb.api.db.crud.manager import insert_manager_with_account
from cdb.api.db.models.account import AccountDBWithAccessKey
from cdb.api.db.models.deployment import DeploymentInput
from cdb.api.db.models.manager import Manager, ManagerInput
from cdb.api.db.models.role import RoleEnum
from cdb.api.v1.dependencies import allowed_jwt_roles

admin_cdb_only = allowed_jwt_roles([RoleEnum.ADMIN_CDB])

router = APIRouter(dependencies=[Depends(admin_cdb_only)])


@router.post("", status_code=201)
async def create_deployment(
    data: DeploymentInput,
    background_tasks: BackgroundTasks,
    db=Depends(connection),
):
    async with db.transaction():
        deployment = await insert_deployment(db, data)

        if deployment is None:
            raise HTTPException(status_code=500, detail="insert deployment failed")

        manager_input = ManagerInput(
            email=data.manager_email,
            lastname=None,
            firstname=None,
            deployment_id=deployment.id,
        )
        try:
            account_manager_tuple: Tuple[
                AccountDBWithAccessKey, Manager
            ] | None = await insert_manager_with_account(
                connection=db, data=manager_input
            )

        except UniqueViolationError as e:
            raise HTTPException(
                status_code=422,
                detail="Un manager avec cette adresse de courriel existe déja.",
            ) from e

        if account_manager_tuple is None:
            raise HTTPException(
                status_code=500, detail="Création du manager impossible."
            )

        account, manager = account_manager_tuple

        background_tasks.add_task(
            send_invitation_email,
            email=manager.email,
            firstname=manager.firstname,
            lastname=manager.lastname,
            access_key=account.access_key,
        )

        return {}
