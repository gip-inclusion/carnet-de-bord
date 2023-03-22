import logging
from typing import List
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from cdb.api.db.models.manager import Manager, ManagerInput


def parse_manager_from_record(record: Record) -> Manager:
    return Manager.parse_obj(record)


async def insert_admin_pdi(
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
