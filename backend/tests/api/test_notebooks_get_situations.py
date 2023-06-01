from urllib.parse import quote
from uuid import UUID

import httpx
import pytest
import respx

from cdb.api.core.settings import settings
from cdb.api.db.crud.notebook_situation import (
    get_ref_situations_with_notebook_situations,
)
from cdb.api.db.graphql import get_client
from cdb.api.db.models.beneficiary import Beneficiary
from cdb.api.db.models.notebook import Notebook
from tests.mocks.pole_emploi_diagnostic import (
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
    notebook_sophie_tifour: Notebook,
    sophie_tifour_contraintes: dict,
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
    ).mock(return_value=httpx.Response(200, json=sophie_tifour_contraintes))

    response = await test_client.get(
        f"/v1/notebooks/{beneficiary_sophie_tifour.notebook.id}/situations",
        headers={"secret-token": "action_secret_token"},
    )

    assert response.status_code == 204

    async with get_client.gql_client_backend_only() as session:
        (_, notebook_situations) = await get_ref_situations_with_notebook_situations(
            session, notebook_sophie_tifour.id
        )

        assert [
            (situation.situationId, situation.createdAt.strftime("%Y-%m-%d"))
            for situation in notebook_situations
        ] == [
            (UUID("8fe751b3-9fca-4239-a8f7-31acf12706a7"), "2023-05-12"),
            (UUID("1d4ea2b8-db7e-4fbc-a902-b04f74fb5dfe"), "2021-09-21"),
            (UUID("8f26b33e-75b6-4051-945d-495ac29c23d1"), "2021-09-21"),
            (UUID("b60da455-c25e-467a-86d0-9341be836509"), "2021-09-21"),
        ]


@pytest.fixture(scope="session")
def sophie_tifour_contraintes() -> dict:
    return {
        "conseiller": "TNAN0260",
        "dateDeModification": "2023-05-12T12:54:39.000+00:00",
        "code": "7",
        "libelle": "Résoudre ses contraintes personnelles",
        "contraintes": [
            {
                "id": 27,
                "nom": "Faire face à des difficultés de logement",
                "valeur": "NON_ABORDEE",
                "date": "2023-05-12T12:54:39.000+00:00",
                "situations": [
                    {
                        "code": "24",
                        "libelle": "Hébergé chez un tiers",
                        "valeur": "OUI",
                    },
                    {
                        "code": "27",
                        "libelle": "Doit quitter le logement",
                        "valeur": "OUI",
                    },
                ],
                "objectifs": [],
            },
            {
                "id": 29,
                "nom": "Faire face à des difficultés administratives ou juridiques",
                "valeur": "CLOTUREE",
                "date": None,
                "situations": [
                    {
                        "code": "36",
                        "libelle": "Besoin d'etre guidé dans le cadre d'un accès aux droits",  # noqa: E501
                        "valeur": "CLOTUREE",
                    },
                ],
                "objectifs": [],
            },
        ],
    }
