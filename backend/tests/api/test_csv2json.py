import json


async def test_parse_csv(
    test_client,
    csv_filepath,
):
    with open(csv_filepath, "rb") as file:
        response = test_client.post(
            "/v1/convert-file/beneficiaries",
            files={"upload_file": ("filename", file, "text/csv")},
        )
        assert response.json()[0][0]["column_name"] == "Identifiant dans le SI*"
        assert response.json()[0][0]["value"] == "1234"
        assert response.json()[0][1]["column_name"] == "Prénom*"
        assert response.json()[0][1]["value"] == "Charlotte"


async def test_parse_csv_errors(
    test_client,
):
    with open("tests/fixtures/import_beneficiaires_buggy.csv", "rb") as file:
        response = test_client.post(
            "/v1/convert-file/beneficiaries",
            files={"upload_file": ("filename", file, "text/csv")},
        )
        assert response.json()[0][3]["column_name"] == "Date de naissance*"
        assert response.json()[0][3]["error_messages"] == ["A value must be provided"]
        assert response.json()[1][3]["column_name"] == "Date de naissance*"
        assert response.json()[1][3]["error_messages"] == [
            "Incorrect date format, The date must be formated as: YYYY-MM-DD"
        ]
