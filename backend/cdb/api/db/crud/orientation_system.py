import logging
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

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
