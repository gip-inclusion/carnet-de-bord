from uuid import UUID

from asyncpg.connection import Connection

from cdb.api.db.crud.professional_project import (
    delete_professional_project_by_id,
    insert_professional_project_for_notebook,
)
from cdb.api.db.models.notebook import Notebook


async def test_insert_professionnal_project(
    db_connection: Connection, notebook_sophie_tifour: Notebook
) -> None:
    query = """
    SELECT COUNT(*) as count
    FROM audit
    WHERE able_name='professional_project' and operation='INSERT'"""

    row_count = await db_connection.fetchrow(query)
    assert row_count["count"] == 34

    professional_project = await insert_professional_project_for_notebook(
        db_connection,
        notebook_sophie_tifour,
        "A1101",
        "Conducteur / Conductrice de matériels de semis",
    )

    assert professional_project is not None

    row_count = await db_connection.fetchrow(query)
    assert row_count["count"] == 35


async def test_delete_professionnal_project(
    db_connection: Connection,
    professional_project_tifour_id: UUID,
) -> None:
    query = """
    SELECT COUNT(*) as count
    FROM audit
    WHERE able_name='professional_project' and operation='DELETE'"""
    result = await db_connection.fetchrow(query)
    assert result["count"] == 0

    await delete_professional_project_by_id(
        db_connection, professional_project_tifour_id
    )

    row_count = await db_connection.fetchrow(query)
    assert row_count["count"] == 1
