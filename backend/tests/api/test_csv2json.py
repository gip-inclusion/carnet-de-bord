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
        assert response.json()[0]["Identifiant dans le SI*"] == 1234
        assert response.json()[0]["Prénom*"] == "Charlotte"
