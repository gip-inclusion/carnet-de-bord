from unittest.mock import MagicMock

from asyncpg.connection import Connection

from api.db.crud.account import get_accounts_from_email
from api.db.crud.manager import get_managers_from_deployment

sendmail_path = "api.v1.routers.managers.send_mail"
api_path = "/v1/managers/create"
sender_email = "test@toto.fr"


async def test_jwt_token_verification(
    test_client,
    get_admin_structure_jwt,
    mocker,
):
    mocker.patch(sendmail_path, return_value=True)

    response = test_client.post(
        api_path,
        json={"email": sender_email, "firstname": "lionel", "lastname": "Bé"},
        headers={"jwt-token": f"{get_admin_structure_jwt}"},
    )

    json = response.json()

    assert response.status_code == 400
    assert json["detail"] == "Role not allowed"


deployment_id = "4dab8036-a86e-4d5f-9bd4-6ce88c1940d0"


async def test_insert_admin_in_db(
    test_client,
    db_connection: Connection,
    get_admin_cdb_jwt,
    mocker,
):
    mocker.patch(sendmail_path, return_value=True)

    test_client.post(
        api_path,
        json={
            "email": sender_email,
            "firstname": "lionel",
            "lastname": "Bé",
            "deployment_id": deployment_id,
        },
        headers={"jwt-token": f"{get_admin_cdb_jwt}"},
    )
    admins = await get_managers_from_deployment(db_connection, deployment_id)

    assert sender_email in [admin.email for admin in admins]

    account1 = await get_accounts_from_email(db_connection, sender_email)
    assert account1[0] is not None


async def test_background_task(test_client, get_admin_cdb_jwt: str, mocker):
    mock: MagicMock = mocker.patch(sendmail_path, return_value=True)
    test_client.post(
        api_path,
        json={
            "email": sender_email,
            "firstname": "lionel",
            "lastname": "Bé",
            "deployment_id": deployment_id,
        },
        headers={"jwt-token": f"{get_admin_cdb_jwt}"},
    )
    assert len(mock.mock_calls) == 1
    assert mock.mock_calls[0].args[0] == sender_email
    assert mock.mock_calls[0].args[1] == "Création de compte sur Carnet de bord"
