from urllib.parse import quote

import httpx
import pytest
import respx

from cdb.api.core.settings import settings
from cdb.api.db.models.beneficiary import Beneficiary
from tests.mocks.pole_emploi_diagnostic import (
    PE_API_CONTRAINTES_INDIVIDUS_RESULT_OK_MOCK,
    PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK,
)

pytestmark = pytest.mark.graphql


async def test_verify_no_token(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
):
    response = await test_client.get(
        f"/v1/notebooks/{beneficiary_sophie_tifour.notebook.id}/situations",
    )
    assert response.status_code == 401
    json = response.json()
    assert json["detail"] == "Missing credentials"


@respx.mock
async def test_get_notebook_situations_nominal(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
):
    respx.post(f"{settings.PE_AUTH_BASE_URL}/connexion/oauth2/access_token").mock(
        return_value=httpx.Response(
            200,
            json={
                "token_type": "foo",
                "access_token": "batman",
                "expires_in": 3600,
            },
        )
    )
    respx.post(
        f"{settings.PE_BASE_URL}/partenaire/rechercher-usager/v1/usagers/recherche",
        json={
            "nir": beneficiary_sophie_tifour.nir,
            "dateNaissance": beneficiary_sophie_tifour.date_of_birth.strftime(
                "%Y-%m-%d"
            ),
        },
    ).mock(
        return_value=httpx.Response(200, json=PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK)
    )

    pe_internal_id = PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK["identifiant"]

    respx.get(
        f"{settings.PE_BASE_URL}/partenaire/diagnosticargumente/v1/individus/{quote(pe_internal_id)}/contraintes",
    ).mock(
        return_value=httpx.Response(
            200, json=PE_API_CONTRAINTES_INDIVIDUS_RESULT_OK_MOCK
        )
    )

    response = await test_client.get(
        f"/v1/notebooks/{beneficiary_sophie_tifour.notebook.id}/situations",
        headers={"secret-token": "action_secret_token"},
    )

    assert response.status_code == 200
