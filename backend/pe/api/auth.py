import requests

from pe.models.auth import AccessToken


async def get_access_token(
    api_url: str,
    client_id: str,
    client_secret: str,
    scope: str,
    grant_type: str = "client_credentials",
) -> AccessToken | None:
    """
    https://pole-emploi.io/data/documentation/utilisation-api-pole-emploi/generer-access-token
    """

    params = {"realm": "/partenaire"}

    data = {
        "grant_type": grant_type,
        "client_id": client_id,
        "client_secret": client_secret,
        "scope": scope,
    }
    response = requests.post(api_url, data=data, params=params)
    if response.status_code == 200:
        json = response.json()
        return AccessToken.parse_obj(json)
