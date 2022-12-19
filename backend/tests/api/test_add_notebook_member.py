from unittest import mock

from asyncpg.connection import Connection
from fastapi.testclient import TestClient

from api.db.crud.notebook import get_notebook_members_by_notebook_id
from api.db.models.notebook import Notebook
from api.db.models.professional import Professional


@mock.patch("api.core.emails.send_mail")
async def test_verify_no_token(
    _: mock.Mock,
    test_client: TestClient,
    notebook_sophie_tifour: Notebook,
):
    response = test_client.post(
        f"/v1/notebooks/{str(notebook_sophie_tifour.id)}/members",
    )
    assert response.status_code == 401
    json = response.json()
    assert json["detail"] == "Missing credentials"


@mock.patch("api.core.emails.send_mail")
async def test_orientation_manager_not_allowed_to_add_notebook_member(
    _: mock.Mock,
    test_client: TestClient,
    guilia_diaby_jwt: str,
    notebook_sophie_tifour: Notebook,
):
    response = test_client.post(
        f"/v1/notebooks/{str(notebook_sophie_tifour.id)}/members",
        headers={"jwt-token": f"{guilia_diaby_jwt}"},
    )
    assert response.status_code == 403
    json = response.json()
    assert json["detail"] == "Operation forbidden to the given role"


# TODO extract this in a test utils module
def assert_member(
    members, person, member_type: str | None = None, active: bool | None = None
):
    assert (
        len(
            [
                member
                for member in members
                if (member_type is None or member.member_type == member_type)
                and member.account_id == person.account_id
                and (active is None or member.active == active)
            ]
        )
        == 1
    )


@mock.patch("api.core.emails.send_mail")
async def test_add_notebook_member_as_no_referent(
    mock_send_email: mock.Mock,
    test_client: TestClient,
    notebook_sophie_tifour: Notebook,
    get_professional_paul_camara_jwt: str,
    professional_paul_camara: Professional,
    db_connection: Connection,
):
    response = test_client.post(
        f"/v1/notebooks/{str(notebook_sophie_tifour.id)}/members",
        headers={"jwt-token": f"{get_professional_paul_camara_jwt}"},
    )
    assert response.status_code == 204
    members = await get_notebook_members_by_notebook_id(
        db_connection,
        notebook_sophie_tifour.id,
    )

    # Check that a new member was added
    assert_member(members, professional_paul_camara)
    # Check that no email is sent since referent doesn't change
    mock_send_email.assert_not_called()
