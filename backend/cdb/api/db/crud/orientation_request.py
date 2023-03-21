import logging
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection
from gql.dsl import DSLField, DSLSchema

from cdb.api.db.models.orientation_request import OrientationRequest

logger = logging.getLogger(__name__)


async def get_orientation_request_by_id(
    connection: Connection, orientation_request_id: UUID
) -> OrientationRequest | None:
    orientation_request: Record | None = await connection.fetchrow(
        "SELECT * FROM orientation_request WHERE id = $1", orientation_request_id
    )

    if orientation_request:
        return OrientationRequest.parse_obj(orientation_request)


def get_accept_orientation_request_mutation(
    dsl_schema: DSLSchema,
    orientation_request_id: UUID,
    orientation_system_id: UUID,
) -> dict[str, DSLField]:
    return {
        "accept_orientation_request": (
            dsl_schema.mutation_root.update_orientation_request_by_pk.args(
                pk_columns={"id": str(orientation_request_id)},
                _set={
                    "decidedAt": "now",
                    "status": "accepted",
                    "decidedOrientationSystemId": str(orientation_system_id),
                },
            ).select(
                dsl_schema.orientation_request.id,
                dsl_schema.orientation_request.createdAt,
            )
        ),
    }
