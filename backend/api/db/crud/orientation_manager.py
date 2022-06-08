from typing import List
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.orientation_manager import (
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
    orientation_manager: OrientationManagerCsvRow,
) -> OrientationManagerDB | None:
    record = await connection.fetchrow(
        """
            INSERT INTO public.orientation_manager(deployment_id, email, firstname, lastname, phone_numbers)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, firstname, lastname, email, phone_numbers, deployment_id, created_at, updated_at
            """,
        deployment_id,
        orientation_manager.email,
        orientation_manager.firstname,
        orientation_manager.lastname,
        orientation_manager.phone_numbers,
    )

    if record:
        return parse_orientation_manager_from_record(record)
    else:
        print(f"insert fail {orientation_manager}")


async def get_orientation_managers(
    connection: Connection,
) -> OrientationManagerDB | None:

    records: List[Record] = await connection.fetch(
        """
        SELECT * FROM public.orientation_manager
        """,
    )
    orientation_managers: List[OrientationManagerDB] = []

    for record in records:
        orientation_managers.append(parse_orientation_manager_from_record(record))

    return orientation_managers
