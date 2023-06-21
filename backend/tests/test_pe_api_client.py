# ruff: noqa: E501

from datetime import datetime, timedelta
from typing import List
from urllib.parse import quote
from zoneinfo import ZoneInfo

import httpx
import pytest
import respx

from cdb.pe.models.agence import Agence
from cdb.pe.models.beneficiary import Beneficiary
from cdb.pe.models.contrainte import Contrainte
from cdb.pe.pole_emploi_client import PoleEmploiApiClient, PoleEmploiAPIException
from tests.mocks.pole_emploi_agences import PE_API_AGENCES_RESULT_OK_MOCK
from tests.mocks.pole_emploi_diagnostic import (
    PE_API_CONTRAINTES_INDIVIDUS_RESULT_OK_MOCK,
    PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK,
)
from tests.utils.approvaltests import verify_as_json


def create_api_client() -> PoleEmploiApiClient:
    api_client = PoleEmploiApiClient(
        auth_base_url="https://some-authentication-domain.fr",
        base_url="https://some-pe-domain.fr",
        client_id="client_id",
        client_secret="client_secret",
        scope="test_scope",
    )
    print("mock: " + api_client.token_url + "?realm=/partenaire")
    respx.post(quote(api_client.token_url + "?realm=/partenaire")).mock(
        return_value=httpx.Response(
            200,
            json={
                "token_type": "foo",
                "access_token": "batman",
                "expires_in": 3600,
            },
        )
    )
    return api_client


@respx.mock
async def test_get_token_nominal():
    api_client = create_api_client()
    now = datetime.now(tz=ZoneInfo("Europe/Paris"))

    await api_client._refresh_token(at=now)

    assert api_client.token == "foo batman"
    assert api_client.expires_at, now + timedelta(seconds=3600)


@respx.mock
async def test_get_token_fails():
    api_client = create_api_client()
    respx.post(quote(api_client.token_url + "?realm=/partenaire")).mock(
        side_effect=httpx.ConnectTimeout
    )

    with pytest.raises(PoleEmploiAPIException):
        await api_client.recherche_pole_emploi_agences("67")


@respx.mock
async def test_recherche_recherche_agences_api_nominal():
    api_client = create_api_client()
    respx.get(api_client.agences_url).mock(
        return_value=httpx.Response(200, json=PE_API_AGENCES_RESULT_OK_MOCK)
    )

    agences = await api_client.recherche_pole_emploi_agences("72")

    assert agences[0]["code"] == "PDL0031"


@respx.mock
async def test_recherche_recherche_agences_api_nominal_pydantic():
    api_client = create_api_client()
    respx.get(api_client.agences_url).mock(
        return_value=httpx.Response(200, json=PE_API_AGENCES_RESULT_OK_MOCK)
    )

    agences: List[Agence] = await api_client.recherche_agences("72")

    assert agences[0].code == "PDL0031"
    assert agences[0].adressePrincipale.ligne4 == "2 AVENUE GEORGES AURIC"


@respx.mock
async def test_recherche_recherche_usagers():
    api_client = create_api_client()
    respx.post(api_client.usagers_url).mock(
        return_value=httpx.Response(200, json=PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK)
    )

    beneficiary: Beneficiary | None = await api_client.search_beneficiary(
        "181036290874034", "1981-03-15"
    )

    assert (
        beneficiary.identifiant
        == PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK["identifiant"]
    )


@respx.mock
async def test_get_contraintes():
    api_client = create_api_client()
    respx.get(
        api_client.contraintes_url(
            "e1881749-1334-47b9-8a34-74922528d4ea%23LQdESFx4KSZklOXWJGJ9yxWLdwqbKWx6dh-9FNc11S0Q4YjU6YhojWUqxyVTWvuk"
        )
    ).mock(
        return_value=httpx.Response(
            200, json=PE_API_CONTRAINTES_INDIVIDUS_RESULT_OK_MOCK
        )
    )

    contraintes: List[Contrainte] = await api_client.get_contraintes(
        "e1881749-1334-47b9-8a34-74922528d4ea#LQdESFx4KSZklOXWJGJ9yxWLdwqbKWx6dh-9FNc11S0Q4YjU6YhojWUqxyVTWvuk"
    )
    verify_as_json([contrainte.json() for contrainte in contraintes])


@respx.mock
async def test_save_contraintes():
    api_client = create_api_client()

    respx.post(
        api_client.contraintes_url(
            "e1881749-1334-47b9-8a34-74922528d4ea%23LQdESFx4KSZklOXWJGJ9yxWLdwqbKWx6dh-9FNc11S0Q4YjU6YhojWUqxyVTWvuk"
        )
    ).mock(return_value=httpx.Response(200, json={}))

    await api_client.save_contraintes(
        "e1881749-1334-47b9-8a34-74922528d4ea#LQdESFx4KSZklOXWJGJ9yxWLdwqbKWx6dh-9FNc11S0Q4YjU6YhojWUqxyVTWvuk",
        [],
        [],
        [],
    )
