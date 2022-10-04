async def test_structure_parse_csv(
    test_client,
    csv_structure_filepath,
    get_manager_jwt,
):
    with open(csv_structure_filepath, "rb") as file:
        response = test_client.post(
            "/v1/convert-file/structures",
            files={"upload_file": ("filename", file, "text/csv")},
            headers={"jwt-token": f"{get_manager_jwt}"},
        )

        data = response.json()
        assert response.status_code == 200


async def test_structure_parse_csv_with_error(
    test_client,
    csv_structure_buggy_filepath,
    get_manager_jwt,
):
    with open(csv_structure_buggy_filepath, "rb") as file:
        response = test_client.post(
            "/v1/convert-file/structures",
            files={"upload_file": ("filename", file, "text/csv")},
            headers={"jwt-token": f"{get_manager_jwt}"},
        )
        data = response.json()

        structure_with_errors = [
            structure for structure in data if structure["valid"] is False
        ]
        assert len(structure_with_errors) == 3
        assert structure_with_errors[0]["errors"][0]["key"] == "Nom"
        assert (
            structure_with_errors[0]["errors"][0]["error"]
            == "none is not an allowed value"
        )

        assert len(structure_with_errors[1]["errors"]) == 3
        assert structure_with_errors[1]["errors"][0]["key"] == "Site web"
        assert (
            structure_with_errors[1]["errors"][0]["error"]
            == "invalid or missing URL scheme"
        )
        assert structure_with_errors[1]["errors"][1]["key"] == "Courriel"
        assert (
            structure_with_errors[1]["errors"][1]["error"]
            == "value is not a valid email address"
        )
        assert structure_with_errors[1]["errors"][2]["key"] == "Courriel responsable"
        assert (
            structure_with_errors[1]["errors"][2]["error"]
            == "value is not a valid email address"
        )

        assert len(structure_with_errors[2]["errors"]) == 2
        assert structure_with_errors[2]["errors"][0]["key"] == "Site web"
        assert (
            structure_with_errors[2]["errors"][0]["error"]
            == "invalid or missing URL scheme"
        )
        assert structure_with_errors[2]["errors"][1]["key"] == "Courriel responsable"
        assert (
            structure_with_errors[2]["errors"][1]["error"]
            == "value is not a valid email address"
        )


async def test_structure_parse_csv_with_missing_column_should_not_fail(
    test_client,
    csv_structure_missing_key_filepath,
    get_manager_jwt,
):
    with open(csv_structure_missing_key_filepath, "rb") as file:
        response = test_client.post(
            "/v1/convert-file/structures",
            files={"upload_file": ("filename", file, "text/csv")},
            headers={"jwt-token": f"{get_manager_jwt}"},
        )
        data = response.json()

        structure_with_errors = [
            structure for structure in data if structure["valid"] is False
        ]
        assert len(structure_with_errors) == 0
