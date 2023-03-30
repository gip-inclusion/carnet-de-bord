import logging
from typing import List
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection
from gql import gql
from gql.client import AsyncClientSession

from cdb.api.db.models.orientation_system import OrientationSystem

logger = logging.getLogger(__name__)


async def get_orientation_system_by_id(
    connection: Connection, orientation_system_id: UUID
) -> OrientationSystem | None:
    orientation_system: Record | None = await connection.fetchrow(
        "SELECT * FROM orientation_system WHERE id = $1", orientation_system_id
    )

    if orientation_system:
        return OrientationSystem.parse_obj(orientation_system)


async def get_available_orientation_systems_gql(
    gql_session: AsyncClientSession, professional_id: UUID
) -> List[UUID]:
    response = await gql_session.execute(
        gql(
            """
            query getProOrientationSystems($professionalId: uuid!) {
              orientation: orientation_system(
                  where: {
                    professionalOrientationSystems: {
                        professionalId: {_eq: $professionalId}
                    }
                  }
                ) {
                  id
              }
            }
            """
        ),
        variable_values={"professionalId": professional_id},
    )
    return [UUID(orientation["id"]) for orientation in response["orientation"]]
