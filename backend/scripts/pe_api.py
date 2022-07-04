import asyncio
import json
import logging
import os

from api.core.db import get_connection_pool
from api.core.settings import settings
from pe.pole_emploi_client import PoleEmploiApiClient

logging.basicConfig(level=logging.INFO)


async def main():

    client = PoleEmploiApiClient(
        auth_base_url=settings.PE_AUTH_BASE_URL,
        base_url=settings.PE_BASE_URL,
        client_id=settings.PE_CLIENT_ID,
        client_secret=settings.PE_CLIENT_SECRET,
        scope=settings.PE_SCOPE,
    )

    agences = client.recherche_agences_pydantic("8")

    print([agence.json() for agence in agences])


if __name__ == "__main__":
    asyncio.run(main())
