from datetime import datetime, timedelta
from typing import List
from unittest import TestCase
from zoneinfo import ZoneInfo

import httpx
import respx

from cdb.pe.models.agence import Agence
from cdb.pe.pole_emploi_client import PoleEmploiApiClient, PoleEmploiAPIException
from tests.mocks.pole_emploi_agences import PE_API_AGENCES_RESULT_OK_MOCK


class PoleEmploiAPIClientTest(TestCase):
    def setUp(self) -> None:
        self.api_client = PoleEmploiApiClient(
            auth_base_url="https://some-authentication-domain.fr",
            base_url="https://some.auth.domain",
            client_id="client_id",
            client_secret="client_secret",
            scope="test_scope",
        )
        respx.post(self.api_client.token_url).mock(
            return_value=httpx.Response(
                200,
                json={
                    "token_type": "foo",
                    "access_token": "batman",
                    "expires_in": 3600,
                },
            )
        )

    @respx.mock
    def test_get_token_nominal(self):
        now = datetime.now(tz=ZoneInfo("Europe/Paris"))
        self.api_client._refresh_token(at=now)
        self.assertEqual(self.api_client.token, "foo batman")
        self.assertEqual(self.api_client.expires_at, now + timedelta(seconds=3600))

    @respx.mock
    def test_get_token_fails(self):
        respx.post(self.api_client.token_url).mock(side_effect=httpx.ConnectTimeout)
        with self.assertRaises(PoleEmploiAPIException) as ctx:
            self.api_client.recherche_pole_emploi_agences("67")
        self.assertEqual(ctx.exception.error_code, "http_error")

    @respx.mock
    def test_recherche_recherche_agences_api_nominal(self):
        respx.get(self.api_client.agences_url).mock(
            return_value=httpx.Response(200, json=PE_API_AGENCES_RESULT_OK_MOCK)
        )
        agences = self.api_client.recherche_pole_emploi_agences("72")
        self.assertEqual(agences[0]["code"], "PDL0031")

    @respx.mock
    def test_recherche_recherche_agences_api_nominal_pydantic(self):
        respx.get(self.api_client.agences_url).mock(
            return_value=httpx.Response(200, json=PE_API_AGENCES_RESULT_OK_MOCK)
        )
        agences: List[Agence] = self.api_client.recherche_agences("72")
        self.assertEqual(agences[0].code, "PDL0031")
        self.assertEqual(agences[0].adressePrincipale.ligne4, "2 AVENUE GEORGES AURIC")
