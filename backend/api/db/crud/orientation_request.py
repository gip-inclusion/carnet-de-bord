import logging
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.orientation_request import OrientationRequest

logger = logging.getLogger(__name__)


async def get_orientation_request_by_id(
    connection: Connection, orientation_request_id: UUID
) -> OrientationRequest | None:
    orientation_requests = await connection.fetch(
        "SELECT * FROM orientation_request WHERE id = $1", orientation_request_id
    )

    if orientation_requests[0] is None:
        return None

    return OrientationRequest.parse_obj(orientation_requests[0])
