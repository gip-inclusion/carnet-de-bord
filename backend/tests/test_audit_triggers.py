from uuid import UUID

from asyncpg.connection import Connection

from cdb.api.db.crud.professional_project import (
    delete_professional_project_by_id,
    insert_professional_project_for_notebook,
    update_professionnal_project_rome_code_by_id,
)
from cdb.api.db.models.notebook import Notebook


async def count_audit(db_connection: Connection, operation_type: str):
    query = f"""
    SELECT COUNT(*) as count
    FROM audit
    WHERE table_name='professional_project' and operation='{operation_type}'"""

    result = await db_connection.fetchrow(query)

    return result["count"]


async def test_insert_professionnal_project(
    db_connection: Connection, notebook_sophie_tifour: Notebook
) -> None:
    assert await count_audit(db_connection, "INSERT") == 34

    professional_project = await insert_professional_project_for_notebook(
        db_connection,
        notebook_sophie_tifour,
        "A1101",
        "Conducteur / Conductrice de matériels de semis",
    )

    assert professional_project is not None

    assert await count_audit(db_connection, "INSERT") == 35


async def test_delete_professionnal_project(
    db_connection: Connection,
    professional_project_tifour_id: UUID,
) -> None:
    assert await count_audit(db_connection, "DELETE") == 0

    await delete_professional_project_by_id(
        db_connection, professional_project_tifour_id
    )

    assert await count_audit(db_connection, "DELETE") == 1


async def test_update_professionnal_project(
    db_connection: Connection,
    professional_project_tifour_id: UUID,
) -> None:
    assert await count_audit(db_connection, "UPDATE") == 0

    await update_professionnal_project_rome_code_by_id(
        db_connection,
        professional_project_tifour_id,
        None,
    )

    assert await count_audit(db_connection, "UPDATE") == 1
