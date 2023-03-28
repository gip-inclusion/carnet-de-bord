import logging
from typing import List, Tuple
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from cdb.api.db.crud.account import (
    create_username,
    get_accounts_with_query,
    insert_manager_account,
)
from cdb.api.db.models.account import AccountDB, AccountDBWithAccessKey
from cdb.api.db.models.manager import Manager, ManagerInput


def parse_manager_from_record(record: Record) -> Manager:
    return Manager.parse_obj(record)


async def insert_manager(
    connection: Connection,
    data: ManagerInput,
) -> Manager | None:
    record = await connection.fetchrow(
        """
        INSERT INTO public.manager(deployment_id, email, firstname, lastname)
        VALUES ($1, $2, $3, $4)
        RETURNING id, firstname, lastname, email, deployment_id, created_at, updated_at
        """,
        data.deployment_id,
        data.email.lower(),
        data.firstname,
        data.lastname,
    )

    if record:
        return parse_manager_from_record(record)
    else:
        logging.error("insert fail %s", data)


async def insert_manager_with_account(
    connection: Connection,
    data: ManagerInput,
) -> Tuple[AccountDBWithAccessKey, Manager] | None:
    """
    We create a new manager with the associated account.
    """
    async with connection.transaction():
        manager: Manager | None = await insert_manager(connection=connection, data=data)
        if not manager:
            logging.error("Insert manager %s failed", data.email)
            return None

        email_username: str = data.email.split("@")[0].lower()
        accounts: List[AccountDB] = await get_accounts_with_query(
            connection,
            """
            WHERE account.username like $1
            """,
            email_username + "%",
        )

        username: str = create_username(
            email_username, [account.username for account in accounts]
        )

        account: AccountDBWithAccessKey | None = await insert_manager_account(
            connection=connection,
            username=username,
            confirmed=True,
            manager_id=manager.id,
        )

        if not account:
            logging.error("Insert admin structure account failed for %s", username)
            return None

        return account, manager


async def get_managers_from_deployment(
    connection: Connection,
    deployment_id: UUID,
) -> List[Manager]:

    records: List[Record] = await connection.fetch(
        """
        SELECT * FROM public.manager WHERE deployment_id=$1 ORDER BY created_at ASC
        """,
        deployment_id,
    )

    return [parse_manager_from_record(record) for record in records]
