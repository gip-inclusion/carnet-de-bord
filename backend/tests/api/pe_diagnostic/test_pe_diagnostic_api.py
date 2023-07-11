from uuid import UUID

import httpx
import pytest
import respx

from cdb.api.core.settings import settings
from cdb.api.db.models.beneficiary import Beneficiary
from cdb.api.db.models.notebook import Notebook

pytestmark = pytest.mark.graphql


@pytest.fixture
async def pe_settings():
    settings.ENABLE_SYNC_CONTRAINTES = True
    yield settings


@pytest.mark.graphql
@respx.mock
async def test_produces_a_400_when_the_pe_api_returns_a_500(
    test_client: httpx.AsyncClient,
    notebook_sophie_tifour: Notebook,
    pe_settings,
):
    """To forward api errors through the Hasura action it needs a 400 error"""
    respx.post(f"{pe_settings.PE_AUTH_BASE_URL}/connexion/oauth2/access_token").mock(
        return_value=httpx.Response(
            500,
            json={
                "token_type": "foo",
                "access_token": "batman",
                "expires_in": 3600,
            },
        )
    )
    response = await call_refresh_api(notebook_sophie_tifour.id, test_client)

    assert response.status_code == 400


@pytest.mark.graphql
@respx.mock
async def test_produces_a_401_when_the_token_is_missing(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
):
    response = await test_client.post(
        "/v1/notebooks/update-notebook-from-pole-emploi",
        json=build_payload(notebook_id=beneficiary_sophie_tifour.notebook.id),
    )
    assert response.status_code == 401
    json = response.json()
    assert json["detail"] == "Missing credentials"


def build_payload(notebook_id: UUID):
    return {
        "action": {"name": "update-notebook-from-pole-emploi"},
        "request_query": "",
        "session_variables": {},
        "input": {
            "notebookId": notebook_id,
        },
    }


async def call_refresh_api(uuid: UUID, test_client):
    response = await test_client.post(
        "/v1/notebooks/update-notebook-from-pole-emploi",
        headers={"secret-token": "action_secret_token"},
        json=build_payload(notebook_id=uuid),
    )
    return response
