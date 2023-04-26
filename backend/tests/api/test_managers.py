from unittest import mock
from uuid import UUID

from asyncpg.connection import Connection
from httpx import AsyncClient

from cdb.api.db.crud.account import get_accounts_from_email
from cdb.api.db.crud.manager import get_managers_from_deployment

ENDPOINT_PATH = "/v1/managers/create"
sender_email = "test@toto.fr"


@mock.patch("cdb.api.v1.routers.managers.send_invitation_email")
async def test_jwt_token_verification(
    _: mock.Mock,
    test_client: AsyncClient,
    get_admin_structure_jwt: str,
):

    response = await test_client.post(
        ENDPOINT_PATH,
        json={"email": sender_email, "firstname": "lionel", "lastname": "Bé"},
        headers={"Authorization": "Bearer " + get_admin_structure_jwt},
    )

    json = response.json()

    assert response.status_code == 403
    assert json["detail"] == "Operation forbidden to the given role"


@mock.patch("cdb.api.v1.routers.managers.send_invitation_email")
async def test_insert_admin_in_db(
    mock_send_invitation_mail: mock.Mock,
    test_client: AsyncClient,
    db_connection: Connection,
    get_admin_cdb_jwt: str,
    deployment_id_cd93: UUID,
):

    await test_client.post(
        ENDPOINT_PATH,
        json={
            "email": sender_email,
            "firstname": "lionel",
            "lastname": "Bé",
            "deployment_id": deployment_id_cd93,
        },
        headers={"Authorization": "Bearer " + get_admin_cdb_jwt},
    )
    admins = await get_managers_from_deployment(db_connection, deployment_id_cd93)

    assert sender_email in [admin.email for admin in admins]

    [account] = await get_accounts_from_email(db_connection, sender_email)
    assert account

    assert mock_send_invitation_mail.call_count == 1
    mock_send_invitation_mail.assert_called_once()
    mock_send_invitation_mail.assert_called_once_with(
        email=sender_email,
        firstname="lionel",
        lastname="Bé",
        access_key=account.access_key,
    )
