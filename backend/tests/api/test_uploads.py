async def test_csv_row(
    test_client, pe_principal_csv_filepath, get_manager_jwt, get_admin_structure_jwt
):
    # @TODO: Upload another file
    with open(pe_principal_csv_filepath, "rb") as f:
        response = test_client.post(
            "/v1/uploads/orientation_manager",
            files={"file": ("filename", f, "text/plain")},
            headers={"jwt-token": f"{get_manager_jwt}"},
        )

        json = response.json()

        assert response.status_code == 400
        assert json["detail"] == "role not allowed"
