from unittest import mock
from uuid import UUID

from asyncpg.connection import Connection
from httpx import AsyncClient

from cdb.api.db.crud.account import get_accounts_from_email
from cdb.api.db.crud.admin_structure import get_admin_structure_by_email
from cdb.api.db.crud.structure import get_structure_by_name, get_structures_with_query

ENDPOINT_PATH = "/v1/structures/import"


@mock.patch("cdb.api.v1.routers.structures.send_invitation_email")
async def test_structure_import_json(
    mock_send_invitation_mail: mock.Mock,
    test_client: AsyncClient,
    import_structures_json: list[dict],
    get_manager_jwt_93: str,
    db_connection: Connection,
    deployment_id_cd93: UUID,
):

    response = await test_client.post(
        ENDPOINT_PATH,
        json={"structures": import_structures_json, "sendAccountEmail": True},
        headers={"Authorization": get_manager_jwt_93},
    )

    data = response.json()
    structure_with_errors = [
        structure for structure in data if structure["valid"] is False
    ]
    assert response.status_code == 200
    assert len(structure_with_errors) == 0

    structure = await get_structure_by_name(
        db_connection,
        "ins'Hair",
        deployment_id_cd93,
    )
    assert structure
    admin = await get_admin_structure_by_email(db_connection, "admin@inshair.fr")
    assert admin
    [account] = await get_accounts_from_email(db_connection, "admin@inshair.fr")
    assert account

    mock_send_invitation_mail.assert_called_once()
    mock_send_invitation_mail.assert_called_once_with(
        email="admin@inshair.fr",
        access_key=account.access_key,
        firstname=None,
        lastname=None,
    )


@mock.patch("cdb.api.v1.routers.structures.send_invitation_email")
async def test_structure_with_buggy_import_json(
    _: mock.Mock,
    test_client: AsyncClient,
    import_structures_json_with_errors: list[dict],
    get_manager_jwt_93: str,
):

    response = await test_client.post(
        ENDPOINT_PATH,
        json={"structures": import_structures_json_with_errors},
        headers={"Authorization": get_manager_jwt_93},
    )

    response.json()
    assert response.status_code == 422


@mock.patch("cdb.api.v1.routers.structures.insert_structure", return_value=None)
async def test_structure_with_fail_structure_insert(
    _: mock.Mock,
    test_client: AsyncClient,
    import_structures_json: list[dict],
    get_manager_jwt_93: str,
):

    response = await test_client.post(
        ENDPOINT_PATH,
        json={"structures": import_structures_json},
        headers={"Authorization": get_manager_jwt_93},
    )

    data = response.json()
    structure_with_errors = [
        structure for structure in data if structure["valid"] is False
    ]
    assert response.status_code == 200
    structure_name = import_structures_json[0]["name"]
    assert (
        structure_with_errors[0]["errors"][0]["error"]
        == f"import structure {structure_name}: insert structure failed"
    )
    assert len(structure_with_errors) == 1


@mock.patch(
    "cdb.api.v1.routers.structures.create_admin_structure_with_account",
    return_value=None,
)
async def test_structure_with_fail_admin_insert(
    _: mock.Mock,
    test_client: AsyncClient,
    import_structures_json: list[dict],
    get_manager_jwt_93: str,
):

    response = await test_client.post(
        ENDPOINT_PATH,
        json={"structures": import_structures_json},
        headers={"Authorization": get_manager_jwt_93},
    )

    data = response.json()
    structure_with_errors = [
        structure for structure in data if structure["valid"] is False
    ]
    assert response.status_code == 200
    structure_name = import_structures_json[0]["name"]
    assert (
        structure_with_errors[0]["errors"][0]["error"]
        == f"import structure {structure_name}: insert structure admin failed"
    )
    assert len(structure_with_errors) == 1


@mock.patch(
    "cdb.api.v1.routers.structures.insert_admin_structure_structure",
    return_value=None,
)
@mock.patch("cdb.api.v1.routers.structures.send_invitation_email")
async def test_structure_with_fail_admin_structure_structure_insert(
    _: mock.Mock,
    __: mock.Mock,
    test_client: AsyncClient,
    import_structures_json: list[dict],
    get_manager_jwt_93: str,
):

    response = await test_client.post(
        ENDPOINT_PATH,
        json={"structures": import_structures_json},
        headers={"Authorization": get_manager_jwt_93},
    )

    data = response.json()
    structure_with_errors = [
        structure for structure in data if structure["valid"] is False
    ]
    assert response.status_code == 200
    structure_name = import_structures_json[0]["name"]
    assert (
        structure_with_errors[0]["errors"][0]["error"]
        == f"import structure {structure_name}: add admin structure to structure failed"
    )
    assert len(structure_with_errors) == 1


async def test_structure_import_same_name_on_another_deployment(
    test_client: AsyncClient,
    import_structures_json: list[dict],
    get_manager_jwt_51: str,
    get_manager_jwt_93: str,
    db_connection: Connection,
):
    # Insert structure into deployment 51
    await test_client.post(
        ENDPOINT_PATH,
        json={"structures": import_structures_json},
        headers={"Authorization": get_manager_jwt_51},
    )

    # Insert same structure into deployment 93
    response = await test_client.post(
        ENDPOINT_PATH,
        json={"structures": import_structures_json},
        headers={"Authorization": get_manager_jwt_93},
    )

    data = response.json()
    structure_with_errors = [
        structure for structure in data if structure["valid"] is False
    ]
    assert response.status_code == 200
    assert len(structure_with_errors) == 0

    structures = await get_structures_with_query(
        db_connection, "where name=$1", "ins'Hair"
    )
    assert len(structures) == 2
