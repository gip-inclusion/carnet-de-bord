from unittest import mock
from uuid import UUID

from asyncpg import Record
from httpx import AsyncClient

manager_email = "test@toto.fr"
ENDPOINT_PATH = "/v1/deployment"


async def test_jwt_token_verification(
    test_client,
    get_admin_structure_jwt,
):
    response = await test_client.post(
        ENDPOINT_PATH,
        json={"email": manager_email, "firstname": "lionel", "lastname": "Bé"},
        headers={"jwt-token": get_admin_structure_jwt},
    )
    json = response.json()
    assert response.status_code == 403
    assert json["detail"] == "Operation forbidden to the given role"


@mock.patch("cdb.api.v1.routers.deployment.send_invitation_email")
async def test_deployment(
    mock_send_invitation_mail: mock.Mock,
    test_client: AsyncClient,
    db_connection,
    get_admin_cdb_jwt,
):
    response = await test_client.post(
        url=ENDPOINT_PATH,
        json={
            "manager_email": manager_email,
            "label": "26 - Drôme",
            "department_code": "26",
        },
        headers={"jwt-token": get_admin_cdb_jwt},
    )
    assert response.status_code == 201
    deployment_row: Record = await db_connection.fetchrow(
        "SELECT * FROM deployment WHERE label=$1", "26 - Drôme"
    )
    assert deployment_row
    assert isinstance(deployment_row["id"], UUID)
    assert deployment_row["department_code"] == "26"
    manager_row: Record = await db_connection.fetchrow(
        """
        SELECT
            account.id, account.access_key, account.username,
            manager.email, manager.deployment_id
        FROM account
        LEFT JOIN manager on manager.id = account.manager_id
        WHERE email=$1
    """,
        manager_email,
    )
    assert manager_row
    assert manager_row["deployment_id"] == deployment_row["id"]
    assert manager_row["username"] == "test"
    assert mock_send_invitation_mail.call_count == 1
    mock_send_invitation_mail.assert_called_once()
    mock_send_invitation_mail.assert_called_once_with(
        email=manager_email,
        access_key=UUID(manager_row["access_key"]),
        lastname=None,
        firstname=None,
    )
