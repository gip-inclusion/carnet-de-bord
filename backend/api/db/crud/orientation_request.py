import logging
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection
from gql.dsl import DSLField, DSLSchema

from api.db.models.orientation_request import OrientationRequest

logger = logging.getLogger(__name__)


async def get_orientation_request_by_id(
    connection: Connection, orientation_request_id: UUID
) -> OrientationRequest | None:
    orientation_request: Record | None = await connection.fetchrow(
        "SELECT * FROM orientation_request WHERE id = $1", orientation_request_id
    )

    if orientation_request:
        return OrientationRequest.parse_obj(orientation_request)


def accept_orientation_request(
    dsl_schema: DSLSchema,
    orientation_request_id: UUID,
    orientation_type: str,
) -> dict[str, DSLField]:
    return {
        "accept_orientation_request": dsl_schema.mutation_root.update_orientation_request_by_pk.args(
            pk_columns={"id": str(orientation_request_id)},
            _set={
                "decidedAt": "now",
                "status": "accepted",
                "decidedOrientationTypeId": orientation_type,
            },
        ).select(
            dsl_schema.orientation_request.id,
            dsl_schema.orientation_request.createdAt,
        ),
    }
