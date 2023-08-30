from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection
from gql.dsl import DSLField, DSLSchema

from cdb.api.db.models.notebook_info import NotebookInfo


def parse_notebook_info(record: Record) -> NotebookInfo:
    return NotebookInfo.parse_obj(record)


async def insert_or_update_need_orientation(
    connection: Connection,
    notebook_id: UUID,
    orientation_system_id: UUID | None,
    need_orientation: bool,
) -> NotebookInfo | None:
    record = await connection.fetchrow(
        """
        INSERT INTO public.notebook_info (notebook_id, orientation_system_id, need_orientation)
        VALUES ($1, $2, $3)
        ON CONFLICT ON CONSTRAINT notebook_info_pkey
        DO UPDATE SET need_orientation = $3
        RETURNING notebook_id, orientation_system_id, need_orientation, created_at, updated_at
        """,  # noqa: E501
        notebook_id,
        orientation_system_id,
        need_orientation,
    )

    if record:
        return parse_notebook_info(record)


async def get_notebook_info(
    connection: Connection, notebook_id: UUID
) -> NotebookInfo | None:
    record = await connection.fetchrow(
        """
        SELECT * from public.notebook_info WHERE notebook_id=$1
        """,
        notebook_id,
    )

    if record:
        return NotebookInfo.parse_obj(record)


def get_insert_notebook_info_mutation(
    dsl_schema: DSLSchema,
    notebook_id: UUID,
    orientation_system_id: UUID,
    orientation_reason: str | None,
) -> dict[str, DSLField]:
    return {
        "add_notebook_info": dsl_schema.mutation_root.insert_notebook_info_one.args(
            object={
                "notebookId": str(notebook_id),
                "orientationSystemId": str(orientation_system_id),
                "orientationReason": orientation_reason,
            },
            on_conflict={
                "constraint": "notebook_info_pkey",
                "update_columns": [
                    "orientationSystemId",
                    "orientationReason",
                ],
            },
        ).select(dsl_schema.notebook_info.notebookId)
    }


def get_insert_notebook_info_orientation_system_mutation(
    dsl_schema: DSLSchema, notebook_id: UUID, orientation_system_id: UUID
) -> dict[str, DSLField]:
    return {
        "upsert_notebook_info_orientation_system": (
            dsl_schema.mutation_root.insert_notebook_info_one.args(
                object={
                    "notebookId": str(notebook_id),
                    "orientationSystemId": str(orientation_system_id),
                    "orientationReason": None,
                },
                on_conflict={
                    "constraint": "notebook_info_pkey",
                    "update_columns": ["orientationSystemId", "orientationReason"],
                },
            ).select(dsl_schema.notebook_info.notebookId)
        )
    }
