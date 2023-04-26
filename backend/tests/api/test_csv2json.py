from httpx import AsyncClient


async def test_parse_csv(
    test_client: AsyncClient,
    csv_beneficiary_filepath: str,
    get_manager_jwt_93: str,
):
    with open(csv_beneficiary_filepath, "rb") as file:
        response = await test_client.post(
            "/v1/convert-file/beneficiaries",
            files={"upload_file": ("filename", file, "text/csv")},
            headers={"Authorization": "Bearer " + get_manager_jwt_93},
        )

        assert response.status_code == 200

        assert response.json()[0]["data"]["Identifiant dans le SI*"] == "1234"
        assert response.json()[0]["data"]["Prénom*"] == "Charlotte"


async def test_parse_csv_with_all_date_formats(
    test_client: AsyncClient,
    csv_beneficiary_with_all_date_formats_filepath: str,
    get_manager_jwt_93: str,
):
    with open(csv_beneficiary_with_all_date_formats_filepath, "rb") as file:
        response = await test_client.post(
            "/v1/convert-file/beneficiaries",
            files={"upload_file": ("filename", file, "text/csv")},
            headers={"Authorization": "Bearer " + get_manager_jwt_93},
        )

        assert response.json()[0]["data"]["Identifiant dans le SI*"] == "1234"
        assert response.json()[0]["data"]["Prénom*"] == "Charlotte"
        assert response.json()[0]["data"]["Date de naissance*"] == "1998-05-25"
        assert response.json()[1]["data"]["Date de naissance*"] == "1997-04-22"


async def test_parse_csv_errors(
    test_client: AsyncClient,
    get_manager_jwt_93: str,
):
    with open("tests/fixtures/import_beneficiaires_buggy.csv", "rb") as file:
        response = await test_client.post(
            "/v1/convert-file/beneficiaries",
            files={"upload_file": ("filename", file, "text/csv")},
            headers={"Authorization": "Bearer " + get_manager_jwt_93},
        )

        assert response.json()[0]["errors"][0]["key"] == "Date de naissance*"
        assert (
            response.json()[0]["errors"][0]["error"] == "none is not an allowed value"
        )

        assert response.json()[1]["errors"][0]["key"] == "Date de naissance*"
        assert (
            response.json()[1]["errors"][0]["error"]
            == "Value is not a known date format. Valid format: YYYY-MM-DD."
        )


async def test_structure_parse_csv(
    test_client: AsyncClient,
    csv_structure_filepath: str,
    get_manager_jwt_93: str,
):
    with open(csv_structure_filepath, "rb") as file:
        response = await test_client.post(
            "/v1/convert-file/structures",
            files={"upload_file": ("filename", file, "text/csv")},
            headers={"Authorization": "Bearer " + get_manager_jwt_93},
        )

        assert response.status_code == 200


async def test_structure_parse_csv_with_error(
    test_client: AsyncClient,
    csv_structure_buggy_filepath: str,
    get_manager_jwt_93: str,
):
    with open(csv_structure_buggy_filepath, "rb") as file:
        response = await test_client.post(
            "/v1/convert-file/structures",
            files={"upload_file": ("filename", file, "text/csv")},
            headers={"Authorization": "Bearer " + get_manager_jwt_93},
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

        assert len(structure_with_errors[1]["errors"]) == 4
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
        assert structure_with_errors[1]["errors"][2]["key"] == "Siret"
        assert (
            structure_with_errors[1]["errors"][2]["error"]
            == "value is not a valid siret"
        )
        assert structure_with_errors[1]["errors"][3]["key"] == "Courriel responsable"
        assert (
            structure_with_errors[1]["errors"][3]["error"]
            == "value is not a valid email address"
        )
        assert len(structure_with_errors[2]["errors"]) == 3
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
        assert structure_with_errors[2]["errors"][2]["key"] == "Téléphones responsable"
        assert (
            structure_with_errors[2]["errors"][2]["error"]
            == "value is not a valid phone number"
        )


async def test_structure_parse_csv_with_missing_column_should_not_fail(
    test_client: AsyncClient,
    csv_structure_missing_key_filepath: str,
    get_manager_jwt_93: str,
):
    with open(csv_structure_missing_key_filepath, "rb") as file:
        response = await test_client.post(
            "/v1/convert-file/structures",
            files={"upload_file": ("filename", file, "text/csv")},
            headers={"Authorization": "Bearer " + get_manager_jwt_93},
        )
        data = response.json()

        structure_with_errors = [
            structure for structure in data if structure["valid"] is False
        ]
        assert len(structure_with_errors) == 0
