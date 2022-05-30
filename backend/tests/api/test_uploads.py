async def test_csv_row(
    test_client,
    get_manager_jwt,
    get_admin_structure_jwt,
    orientation_manager_csv_filepath,
):
    with open(orientation_manager_csv_filepath) as f:

        response = test_client.post(
            "/v1/uploads/orientation_manager",
            files={"upload_file": ("filename", f, "text/plain")},
            headers={"jwt-token": f"{get_manager_jwt}"},
        )

        json = response.json()

        assert response.status_code == 400
        assert json["detail"] == "Role not allowed"

    with open(orientation_manager_csv_filepath) as f:
        response = test_client.post(
            "/v1/uploads/orientation_manager",
            files={"upload_file": ("filename", f, "text/plain")},
            headers={"jwt-token": f"{get_admin_structure_jwt}"},
        )

        json = response.json()

        assert response.status_code == 200
        assert len(json) == 2
        assert json[0]["email"] == "woirnesse@cd26.fr"
        assert json[1]["email"] == "cyane@cd26.fr"
