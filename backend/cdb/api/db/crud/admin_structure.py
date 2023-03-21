import logging
from typing import List, Tuple
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from cdb.api.db.crud.account import (
    create_username,
    get_accounts_with_query,
    insert_admin_structure_account,
)
from cdb.api.db.models.account import AccountDB, AccountDBWithAccessKey
from cdb.api.db.models.admin_structure import (
    AdminStructure,
    AdminStructureInput,
    AdminStructureStructureInput,
)


async def get_admin_structure_by_email(
    connection: Connection, email: str
) -> AdminStructure | None:
    return await get_admin_structure_with_query(
        connection,
        """
            , public.account
            WHERE account.admin_structure_id = admin_structure.id
            AND admin_structure.email = $1
            """,
        email,
    )


def parse_admin_structure_from_record(record: Record) -> AdminStructure:
    return AdminStructure.parse_obj(record)


async def insert_admin_structure(
    connection: Connection,
    data: AdminStructureInput,
) -> AdminStructure | None:
    record = await connection.fetchrow(
        """
        INSERT INTO public.admin_structure(deployment_id, email, firstname, lastname, phone_numbers, position)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, firstname, lastname, email, phone_numbers, position, deployment_id, created_at, updated_at
        """,  # noqa: E501
        data.deployment_id,
        data.email.lower(),
        data.firstname,
        data.lastname,
        data.phone_numbers,
        data.position,
    )

    if record:
        return parse_admin_structure_from_record(record)
    else:
        logging.error(f"insert_admin_structure fail {data}")


async def insert_admin_structure_structure(
    connection: Connection, admin_structure_id: UUID, structure_id: UUID
) -> UUID | None:
    record = await connection.fetchrow(
        """
        INSERT INTO public.admin_structure_structure(admin_structure_id, structure_id)
        VALUES ($1, $2)
        ON CONFLICT ON CONSTRAINT admin_structure_structure_admin_structure_id_structure_id_key
        DO UPDATE SET deleted_at = NULL
        RETURNING id
        """,  # noqa: E501
        admin_structure_id,
        structure_id,
    )
    if record:
        return record["id"]


async def get_admin_structure_with_query(
    connection: Connection, query: str, *args
) -> AdminStructure | None:

    record: Record = await connection.fetchrow(
        """
        SELECT admin_structure.* FROM public.admin_structure
        {query}
        """.format(
            query=query
        ),
        *args,
    )

    if record:
        return parse_admin_structure_from_record(record)


async def create_admin_structure_with_account(
    connection: Connection, data: AdminStructureStructureInput
) -> Tuple[AccountDBWithAccessKey, AdminStructure] | None:
    """
    Creation d'un profil admin_structure et du compte associé
    """
    async with connection.transaction():
        admin_structure: AdminStructure | None = await insert_admin_structure(
            connection=connection, data=data.admin
        )

        if not admin_structure:
            logging.error(f"Insert admin structure {data.admin.email} failed")
            return None

        email_username: str = data.admin.email.split("@")[0].lower()

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

        account: AccountDBWithAccessKey | None = await insert_admin_structure_account(
            connection=connection,
            admin_structure_id=admin_structure.id,
            confirmed=True,
            username=username,
        )

        if not account:
            logging.error("Insert admin structure account failed for {username}")
            return None

        return account, admin_structure
