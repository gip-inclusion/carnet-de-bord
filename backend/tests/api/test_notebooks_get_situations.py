import httpx
import pytest
import respx

from cdb.api.core.settings import settings
from cdb.api.db.models.notebook import Notebook
from cdb.pe.pole_emploi_client import PoleEmploiApiClient
from tests.mocks.pole_emploi_recherche_usagers import (
    PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK,
)

pytestmark = pytest.mark.graphql


async def test_verify_no_token(
    test_client: httpx.AsyncClient,
    notebook_sophie_tifour: Notebook,
):
    response = await test_client.get(
        f"/v1/notebooks/{notebook_sophie_tifour.id}/situations",
    )
    assert response.status_code == 401
    json = response.json()
    assert json["detail"] == "Missing credentials"


@respx.mock
async def test_get_notebook_situations_nominal(
    test_client: httpx.AsyncClient,
    notebook_sophie_tifour: Notebook,
):

    client = PoleEmploiApiClient(
        auth_base_url=settings.PE_AUTH_BASE_URL,
        base_url=settings.PE_BASE_URL,
        client_id=settings.PE_CLIENT_ID,
        client_secret=settings.PE_CLIENT_SECRET,
        scope=settings.PE_SCOPE,
    )
    respx.post(client.token_url).mock(
        return_value=httpx.Response(
            200,
            json={
                "token_type": "foo",
                "access_token": "batman",
                "expires_in": 3600,
            },
        )
    )

    respx.post(client.usagers_url).mock(
        return_value=httpx.Response(200, json=PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK)
    )

    response = await test_client.get(
        f"/v1/notebooks/{notebook_sophie_tifour.id}/situations",
        headers={"secret-token": "action_secret_token"},
    )
    assert response.status_code == 200
