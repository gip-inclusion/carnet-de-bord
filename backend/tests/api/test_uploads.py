from unittest.mock import MagicMock

from asyncpg.connection import Connection

from api.db.crud.account import get_accounts_from_email
from api.db.crud.orientation_manager import get_orientation_managers


async def test_jwt_token_verification(
    test_client,
    get_admin_structure_jwt,
    orientation_manager_csv_filepath,
    mocker,
):
    mocker.patch("api.v1.routers.uploads.send_mail", return_value=True)
    with open(orientation_manager_csv_filepath, "rb") as f:

        response = test_client.post(
            "/v1/uploads/orientation_manager",
            files={"upload_file": ("filename", f, "text/plain")},
            headers={"jwt-token": f"{get_admin_structure_jwt}"},
        )

        json = response.json()

        assert response.status_code == 400
        assert json["detail"] == "Role not allowed"


async def test_insert_in_db(
    test_client,
    db_connection: Connection,
    orientation_manager_csv_filepath,
    get_manager_jwt,
    mocker,
):
    mocker.patch("api.v1.routers.uploads.send_mail", return_value=True)

    with open(orientation_manager_csv_filepath, "rb") as f:
        test_client.post(
            "/v1/uploads/orientation_manager",
            files={"upload_file": ("filename", f, "text/plain")},
            headers={"jwt-token": f"{get_manager_jwt}"},
        )
        orientation_managers = await get_orientation_managers(db_connection)
        assert len(orientation_managers) == 3

        account1 = await get_accounts_from_email(db_connection, "woirnesse@cd26.fr")
        assert account1[0] is not None

        account2 = await get_accounts_from_email(db_connection, "cyane@cd26.fr")
        assert account2[0] is not None


async def test_background_task(
    test_client, orientation_manager_csv_filepath, get_manager_jwt: str, mocker
):
    mock: MagicMock = mocker.patch(
        "api.v1.routers.uploads.send_mail", return_value=True
    )
    with open(orientation_manager_csv_filepath, "rb") as f:
        test_client.post(
            "/v1/uploads/orientation_manager",
            files={"upload_file": ("filename", f, "text/plain")},
            headers={"jwt-token": f"{get_manager_jwt}"},
        )

    assert len(mock.mock_calls) == 2
    assert mock.mock_calls[0].args[0] == "woirnesse@cd26.fr"
    assert mock.mock_calls[0].args[1] == "Création de compte sur Carnet de bord"
    assert mock.mock_calls[1].args[0] == "cyane@cd26.fr"
    assert mock.mock_calls[1].args[1] == "Création de compte sur Carnet de bord"


async def test_validation_error(
    test_client, orientation_manager_csv_filepath, get_manager_jwt: str, mocker
):
    mock: MagicMock = mocker.patch(
        "api.v1.routers.uploads.send_mail", return_value=True
    )
    with open(orientation_manager_csv_filepath, "rb") as f:
        response = test_client.post(
            "/v1/uploads/orientation_manager",
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


async def test_handle_xls(
    test_client, orientation_manager_xls_filepath, get_manager_jwt: str, mocker
):
    mocker.patch("api.v1.routers.uploads.send_mail", return_value=True)
    with open(orientation_manager_xls_filepath, "rb") as f:
        response = test_client.post(
            "/v1/uploads/orientation_manager",
            files={"upload_file": ("filename", f, "application/vnd.ms-excel")},
            headers={"jwt-token": f"{get_manager_jwt}"},
        )
        assert response.status_code == 200
        json = response.json()

        assert json[0]["valid"]
        assert json[1]["valid"]


async def test_handle_xlsx(
    test_client, orientation_manager_xlsx_filepath, get_manager_jwt: str, mocker
):
    mocker.patch("api.v1.routers.uploads.send_mail", return_value=True)
    with open(orientation_manager_xlsx_filepath, "rb") as f:
        response = test_client.post(
            "/v1/uploads/orientation_manager",
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
