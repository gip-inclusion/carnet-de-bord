from unittest import mock

from asyncpg.connection import Connection

from api.db.crud.account import get_accounts_from_email
from api.db.crud.orientation_manager import get_orientation_managers

ENDPOINT_PATH = "/v1/uploads/orientation_manager"


@mock.patch("api.v1.routers.uploads.send_invitation_email")
async def test_jwt_token_verification(
    mock_send_invitation_email: mock.Mock,
    test_client,
    get_admin_structure_jwt,
    orientation_manager_csv_filepath,
):
    with open(orientation_manager_csv_filepath, "rb") as f:

        response = test_client.post(
            ENDPOINT_PATH,
            files={"upload_file": ("filename", f, "text/plain")},
            headers={"jwt-token": f"{get_admin_structure_jwt}"},
        )

        json = response.json()

        assert response.status_code == 400
        assert json["detail"] == "Role not allowed"


@mock.patch("api.v1.routers.uploads.send_invitation_email")
async def test_insert_in_db(
    mock_send_invitation_email: mock.Mock,
    test_client,
    db_connection: Connection,
    orientation_manager_csv_filepath,
    get_manager_jwt,
):

    with open(orientation_manager_csv_filepath, "rb") as f:
        test_client.post(
            ENDPOINT_PATH,
            files={"upload_file": ("filename", f, "text/plain")},
            headers={"jwt-token": f"{get_manager_jwt}"},
        )
        orientation_managers = await get_orientation_managers(db_connection)
        assert len(orientation_managers) == 5

        account1 = await get_accounts_from_email(db_connection, "woirnesse@cd26.fr")
        assert account1[0] is not None

        account2 = await get_accounts_from_email(db_connection, "cyane@cd26.fr")
        assert account2[0] is not None

        assert mock_send_invitation_email.call_count == 2
        assert (
            mock_send_invitation_email.call_args_list[0].kwargs["email"]
            == "woirnesse@cd26.fr"
        )
        assert (
            mock_send_invitation_email.call_args_list[1].kwargs["email"]
            == "cyane@cd26.fr"
        )


@mock.patch("api.v1.routers.uploads.send_invitation_email")
async def test_validation_error(
    mock_send_invitation_email: mock.Mock,
    test_client,
    orientation_manager_csv_filepath,
    get_manager_jwt: str,
):

    with open(orientation_manager_csv_filepath, "rb") as f:
        response = test_client.post(
            ENDPOINT_PATH,
            files={"upload_file": ("filename", f, "text/plain")},
            headers={"jwt-token": f"{get_manager_jwt}"},
        )
        json = response.json()

        assert json[0]["valid"]
        assert json[1]["valid"]
        assert not json[2]["valid"]
        assert json[2]["error"] == "none is not an allowed value"
        assert not json[3]["valid"]
        assert json[3]["error"] == "value is not a valid email address"


@mock.patch("api.v1.routers.uploads.send_invitation_email")
async def test_handle_xls(
    mock_send_invitation_email: mock.Mock,
    test_client,
    orientation_manager_xls_filepath,
    get_manager_jwt: str,
):
    with open(orientation_manager_xls_filepath, "rb") as f:
        response = test_client.post(
            ENDPOINT_PATH,
            files={"upload_file": ("filename", f, "application/vnd.ms-excel")},
            headers={"jwt-token": f"{get_manager_jwt}"},
        )
        assert response.status_code == 200
        json = response.json()

        assert json[0]["valid"]
        assert json[1]["valid"]


@mock.patch("api.v1.routers.uploads.send_invitation_email")
async def test_handle_xlsx(
    mock_send_invitation_email: mock.Mock,
    test_client,
    orientation_manager_xlsx_filepath,
    get_manager_jwt: str,
):
    with open(orientation_manager_xlsx_filepath, "rb") as f:
        response = test_client.post(
            ENDPOINT_PATH,
            files={
                "upload_file": (
                    "filename",
                    f,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                )
            },
            headers={"jwt-token": f"{get_manager_jwt}"},
        )
        assert response.status_code == 200
        json = response.json()

        assert json[0]["valid"]
        assert json[1]["valid"]
