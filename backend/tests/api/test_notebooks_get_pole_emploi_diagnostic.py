import pytest
from fastapi.testclient import TestClient

from cdb.api.db.models.notebook import Notebook

pytestmark = pytest.mark.graphql


async def test_verify_no_token(
    test_client: TestClient,
    notebook_sophie_tifour: Notebook,
):
    response = await test_client.get(
        f"/v1/notebooks/{notebook_sophie_tifour.id}/pole-emploi-diagnostic",
    )
    assert response.status_code == 401
    json = response.json()
    assert json["detail"] == "Missing credentials"
