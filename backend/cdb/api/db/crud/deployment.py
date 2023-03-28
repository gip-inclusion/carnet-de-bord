from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from cdb.api.db.models.deployment import Deployment, DeploymentInput


async def insert_deployment(connection: Connection, deployment_info: DeploymentInput):
    result: Record = await connection.fetchrow(
        """
        INSERT INTO deployment (label, department_code)
        VALUES ($1, $2)
        RETURNING id, label, department_code
        """,
        deployment_info.label,
        deployment_info.department_code,
    )
    if result:
        return Deployment.parse_obj(result)


async def get_deployment_by_id(connection: Connection, id: UUID) -> Deployment | None:
    row = await connection.fetchrow(
        """
        select * from deployment where id = $1
        """,
        id,
    )
    if row:
        return Deployment.parse_obj(row)
