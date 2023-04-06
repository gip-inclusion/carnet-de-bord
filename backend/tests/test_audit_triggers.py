import json
from uuid import UUID

from asyncpg.connection import Connection
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport

from cdb.api.core.settings import settings
from cdb.api.db.crud.professional_project import (
    delete_professional_project_by_id,
    insert_professional_project_for_notebook,
)
from cdb.api.db.crud.rome_code import get_rome_code_by_description_and_code
from cdb.api.db.models.notebook import Notebook
from cdb.api.db.models.professional import Professional


async def count_audit(db_connection: Connection, operation_type: str):
    query = f"""
    SELECT COUNT(*) as count
    FROM audit
    WHERE table_name='professional_project' and operation='{operation_type}'"""

    result = await db_connection.fetchrow(query)

    return result["count"]


async def test_insert_professional_project(
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


async def test_delete_professional_project(
    db_connection: Connection,
    professional_project_tifour_id: UUID,
) -> None:
    assert await count_audit(db_connection, "DELETE") == 0

    await delete_professional_project_by_id(
        db_connection, professional_project_tifour_id
    )

    assert await count_audit(db_connection, "DELETE") == 1


async def test_update_professional_project_without_session(
    db_connection: Connection,
    professional_project_tifour_id: UUID,
) -> None:
    assert await count_audit(db_connection, "UPDATE") == 0

    await db_connection.fetchrow(
        """
UPDATE professional_project set rome_code_id = $1
WHERE professional_project.id = $2
        """,
        None,
        professional_project_tifour_id,
    )

    assert await count_audit(db_connection, "UPDATE") == 1

    query = "SELECT * FROM audit ORDER BY created_at desc"

    result = await db_connection.fetchrow(query)

    assert result["created_by"] is None

    old_val = json.loads(result["old_val"])
    new_val = json.loads(result["new_val"])
    assert old_val["rome_code_id"] == "09af6b49-73d6-4ee3-a553-52dd0b346a3b"
    assert new_val["rome_code_id"] is None


async def test_update_professional_project_with_graphql(
    db_connection: Connection,
    professional_project_tifour_id: UUID,
    get_professional_pierre_chevalier_jwt: str,
    professional_pierre_chevalier: Professional,
) -> None:
    assert await count_audit(db_connection, "UPDATE") == 0

    update_professional_project_gql = gql(
        """
    mutation UpdateProfessionalProject($id: uuid!) {
    professional_project: update_professional_project_by_pk(
        pk_columns: { id: $id }
        _set: { romeCodeId: null }
    ) {
        id
    }
    }
    """
    )

    transport = AIOHTTPTransport(
        url=settings.graphql_api_url,
        headers={"Authorization": "Bearer " + get_professional_pierre_chevalier_jwt},
    )

    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:
        result = await session.execute(
            update_professional_project_gql,
            variable_values={"id": professional_project_tifour_id},
        )

        assert await count_audit(db_connection, "UPDATE") == 1

    query = "SELECT * FROM audit ORDER BY created_at desc"

    result = await db_connection.fetchrow(query)

    assert result["created_by"] == professional_pierre_chevalier.account_id


async def test_insert_professional_project_with_graphql(
    db_connection: Connection,
    get_professional_pierre_chevalier_jwt: str,
    professional_pierre_chevalier: Professional,
) -> None:
    assert await count_audit(db_connection, "INSERT") == 34

    insert_professional_project_gql = gql(
        """
    mutation insertProfessionalProject($object: professional_project_insert_input! ) {
      insert_professional_project_one(object: $object) {
        id
      }
    }
    """
    )

    transport = AIOHTTPTransport(
        url=settings.graphql_api_url,
        headers={"Authorization": "Bearer " + get_professional_pierre_chevalier_jwt},
    )

    rome_code = await get_rome_code_by_description_and_code(
        db_connection, "Chauffeur / Chauffeuse de machines agricoles", "A1101"
    )

    professional_project_object = {
        "object": {
            "notebookId": "9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d",
            "romeCodeId": rome_code.id,
        }
    }
    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:
        result = await session.execute(
            insert_professional_project_gql,
            variable_values=professional_project_object,
        )

        assert await count_audit(db_connection, "INSERT") == 35

    query = "SELECT * FROM audit ORDER BY created_at desc"

    result = await db_connection.fetchrow(query)

    assert result["created_by"] == professional_pierre_chevalier.account_id
