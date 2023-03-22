import logging
from typing import List, Tuple
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from cdb.api.db.crud.account import (
    create_username,
    get_accounts_with_query,
    insert_orientation_manager_account,
)
from cdb.api.db.models.account import AccountDB, AccountDBWithAccessKey
from cdb.api.db.models.orientation_manager import (
    OrientationManagerCsvRow,
    OrientationManagerDB,
)


def parse_orientation_manager_from_record(record: Record) -> OrientationManagerDB:
    return OrientationManagerDB(
        id=record["id"],
        firstname=record["firstname"],
        lastname=record["lastname"],
        email=record["email"],
        phone_numbers=record["phone_numbers"],
        deployment_id=record["deployment_id"],
        created_at=record["created_at"],
        updated_at=record["updated_at"],
    )


async def insert_orientation_manager(
    connection: Connection,
    deployment_id: UUID,
    data: OrientationManagerCsvRow,
) -> OrientationManagerDB | None:
    record = await connection.fetchrow(
        """
        INSERT INTO public.orientation_manager(deployment_id, email, firstname, lastname, phone_numbers)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, firstname, lastname, email, phone_numbers, deployment_id, created_at, updated_at
        """,  # noqa: E501
        deployment_id,
        data.email,
        data.firstname,
        data.lastname,
        data.phone_numbers,
    )

    if not record:
        logging.error("insert fail %s", data)
        return None

    return parse_orientation_manager_from_record(record)


async def get_orientation_managers(
    connection: Connection,
) -> List[OrientationManagerDB]:

    records: List[Record] = await connection.fetch(
        """
        SELECT * FROM public.orientation_manager ORDER BY created_at ASC
        """,
    )

    return [parse_orientation_manager_from_record(record) for record in records]


async def create_orientation_manager_with_account(
    connection: Connection, data: OrientationManagerCsvRow, deployment_id: UUID
) -> Tuple[AccountDBWithAccessKey, OrientationManagerDB] | None:
    """
    Creation d'un profil admin_structure et du compte associé
    """
    async with connection.transaction():
        orientation_manager: OrientationManagerDB | None = (
            await insert_orientation_manager(
                connection=connection, deployment_id=deployment_id, data=data
            )
        )

        if not orientation_manager:
            logging.error("Insert orientation manager %s failed", data.email)
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

        account: AccountDBWithAccessKey | None = (
            await insert_orientation_manager_account(
                connection=connection,
                username=orientation_manager.email,
                confirmed=True,
                orientation_manager_id=orientation_manager.id,
            )
        )

        if not account:
            logging.error("Insert admin structure account failed for %s", username)
            return None

        return account, orientation_manager
