import logging
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.admin_structure import AdminStructure


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
