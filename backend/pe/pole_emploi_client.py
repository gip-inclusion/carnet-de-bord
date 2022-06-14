import logging
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Union
from zoneinfo import ZoneInfo

import httpx

logger = logging.getLogger(__name__)

API_CLIENT_HTTP_ERROR_CODE = "http_error"


class PoleEmploiAPIException(Exception):
    """unexpected exceptions (meaning, "exceptional") that warrant a subsequent retry."""

    def __init__(self, error_code):
        self.error_code = error_code
        super().__init__()


API_CLIENT_EMPTY_NIR_BAD_RESPONSE = "empty_nir"


class PoleEmploiAPIBadResponse(Exception):
    """errors that can't be recovered from: the API server does not agree."""

    def __init__(self, response_code):
        self.response_code = response_code
        super().__init__()


API_TIMEOUT_SECONDS = 60  # this API is pretty slow, let's give it a chance


@dataclass
class PoleEmploiApiClient:

    auth_base_url: str
    base_url: str
    client_id: str
    client_secret: str
    scope: str
    tz: str = "Europe/Paris"
    token: Union[str, None] = None
    expires_at: Union[datetime, None] = None

    @property
    def token_url(self):
        return f"{self.auth_base_url}/connexion/oauth2/access_token"

    @property
    def recherche_individu_url(self):
        return f"{self.base_url}/rechercheindividucertifie/v1/rechercheIndividuCertifie"

    @property
    def mise_a_jour_url(self):
        return f"{self.base_url}/maj-pass-iae/v1/passIAE/miseAjour"

    def _refresh_token(self, at=None):
        if not at:
            at = datetime.now(tz=ZoneInfo(self.tz))
        if self.expires_at and self.expires_at > at:
            return

        response = httpx.post(
            self.token_url,
            params={"realm": "/partenaire"},
            data={
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "grant_type": "client_credentials",
                "scope": self.scope,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        response.raise_for_status()
        auth_data = response.json()
        self.token = f"{auth_data['token_type']} {auth_data['access_token']}"
        self.expires_at = at + timedelta(seconds=auth_data["expires_in"])

    @property
    def _headers(self):
        return {"Authorization": self.token, "Content-Type": "application/json"}

    def _request(self, url, data):
        try:
            self._refresh_token()
            response = httpx.post(
                url, json=data, headers=self._headers, timeout=API_TIMEOUT_SECONDS
            )
            data = response.json()
            if response.status_code != 200:
                raise PoleEmploiAPIException(response.status_code)
            return data
        except httpx.RequestError as exc:
            raise PoleEmploiAPIException(API_CLIENT_HTTP_ERROR_CODE) from exc
