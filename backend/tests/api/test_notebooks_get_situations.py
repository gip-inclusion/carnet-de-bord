from urllib.parse import quote

import httpx
import pytest
import respx
from gql import gql

from cdb.api.core.settings import settings
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


@pytest.mark.graphql
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

    assert response.status_code == 200
    result = response.json()
    assert result["data_has_been_updated"] is True

    async with get_client.gql_client_backend_only() as session:
        result = await session.execute(
            gql(
                """
            query situation($id: uuid!) {
                notebook_situation(
                    where: {notebookId: {_eq: $id}  deletedAt: {_is_null: true}}
                    order_by: {createdAt: desc}
                ) {
                    id, refSituation{ description} createdAt
                }
            }
        """
            ),
            variable_values={"id": notebook_sophie_tifour.id},
        )
        assert result["notebook_situation"]

        assert [
            (
                situation["refSituation"]["description"],
                situation["createdAt"].split("T")[0],
            )
            for situation in result["notebook_situation"]
        ] == [
            ("Doit quitter le logement", "2023-05-12"),
            ("Hébergé chez un tiers", "2021-09-21"),
        ]


@pytest.mark.graphql
@respx.mock
async def test_get_notebook_situations_get_no_situations(
    test_client: httpx.AsyncClient,
    beneficiary_sophie_tifour: Beneficiary,
    empty_contraintes: dict,
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
    ).mock(return_value=httpx.Response(200, json=empty_contraintes))

    response = await test_client.get(
        f"/v1/notebooks/{beneficiary_sophie_tifour.notebook.id}/situations",
        headers={"secret-token": "action_secret_token"},
    )

    assert response.status_code == 200
    result = response.json()
    assert result["data_has_been_updated"] is False


@pytest.fixture(scope="session")
def empty_contraintes() -> dict:
    return {
        "conseiller": "TNAN0260",
        "dateDeModification": "2023-05-12T12:54:39.000+00:00",
        "code": "7",
        "libelle": "Résoudre ses contraintes personnelles",
        "contraintes": [],
    }


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
