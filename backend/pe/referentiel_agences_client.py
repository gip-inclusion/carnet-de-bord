import asyncio

from pe.api.auth import get_access_token
from pe.models.auth import AccessToken
from pe.settings import settings


async def main():
    access_token: AccessToken | None = await get_access_token(
        settings.pe_access_token_api_url,
        settings.pe_client_id,
        settings.pe_client_secret,
        settings.pe_referentielagences_scope,
    )

    print(access_token)


if __name__ == "__main__":
    asyncio.run(main())
