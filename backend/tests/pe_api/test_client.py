from datetime import datetime, timedelta
from unittest import TestCase
from zoneinfo import ZoneInfo

import httpx
import respx

from pe.pole_emploi_client import PoleEmploiApiClient


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
