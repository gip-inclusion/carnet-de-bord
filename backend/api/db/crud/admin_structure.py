import logging
from typing import List, Tuple
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.crud.account import (
    create_username,
    get_accounts_with_query,
    insert_admin_structure_account,
)
from api.db.models.account import AccountDB
from api.db.models.admin_structure import AdminStructure, AdminStructureStructureInput


def parse_admin_structure_from_record(record: Record) -> AdminStructure:
    return AdminStructure.parse_obj(record)


async def insert_admin_structure(
    connection: Connection,
    data: AdminStructure,
) -> AdminStructure | None:
    record = await connection.fetchrow(
        """
            INSERT INTO public.admin_structure(deployment_id, email, firstname, lastname, phone_numbers)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, firstname, lastname, email, phone_numbers, deployment_id, created_at, updated_at
            """,
        data.deployment_id,
        data.email.lower(),
        data.firstname,
        data.lastname,
        data.phone_numbers,
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
            """,
        admin_structure_id,
        structure_id,
    )
    if record:
        return record["id"]
    else:
        logging.error(
            f"insert_admin_structure_structure fail {admin_structure_id} {structure_id}"
        )


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
) -> Tuple[AccountDB, AdminStructure]:
    """
    Creation d'un profil admin_structure et du compte associé
    """

    admin_structure: AdminStructure | None = await insert_admin_structure(
        connection=connection, data=data.admin
    )

    if admin_structure is None:
        raise InsertFailError("insert admin_structure failed")

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

    account: AccountDB | None = await insert_admin_structure_account(
        connection=connection,
        admin_structure_id=admin_structure.id,
        confirmed=True,
        username=username,
    )

    if not account:
        logging.error("Insert account failed")
        raise InsertFailError("insert account failed")

    return account, admin_structure


class InsertFailError(Exception):
    """
    utility class when insert goes wrong
    """
