from asyncpg.connection import Connection

from api.db.crud.orientation_manager import get_orientation_managers


async def test_jwt_token_verification(
    test_client,
    get_manager_jwt,
    get_admin_structure_jwt,
    orientation_manager_csv_filepath,
):
    with open(orientation_manager_csv_filepath) as f:

        response = test_client.post(
            "/v1/uploads/orientation_manager",
            files={"upload_file": ("filename", f, "text/plain")},
            headers={"jwt-token": f"{get_admin_structure_jwt}"},
        )

        json = response.json()

        assert response.status_code == 400
        assert json["detail"] == "Role not allowed"

    with open(orientation_manager_csv_filepath) as f:
        response = test_client.post(
            "/v1/uploads/orientation_manager",
            files={"upload_file": ("filename", f, "text/plain")},
            headers={"jwt-token": f"{get_manager_jwt}"},
        )

        json = response.json()

        assert response.status_code == 200
        assert len(json) == 3
        assert json[0]["email"] == "woirnesse@cd26.fr"
        assert json[1]["email"] == "cyane@cd26.fr"
        assert json[2]["valid"] == False


async def test_insert_in_db(
    test_client,
    db_connection: Connection,
    orientation_manager_csv_filepath,
    get_manager_jwt,
):
    with open(orientation_manager_csv_filepath) as f:
        response = test_client.post(
            "/v1/uploads/orientation_manager",
            files={"upload_file": ("filename", f, "text/plain")},
            headers={"jwt-token": f"{get_manager_jwt}"},
        )

        orientation_managers = await get_orientation_managers(db_connection)

        assert len(orientation_managers) == 2
