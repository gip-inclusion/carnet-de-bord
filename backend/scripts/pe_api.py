import asyncio
import logging
import os

from api.core.db import get_connection_pool
from api.core.settings import settings
from pe.pole_emploi_client import PoleEmploiApiClient

logging.basicConfig(level=logging.INFO)


async def main():

    client = PoleEmploiApiClient(
        auth_base_url="https://entreprise.pole-emploi.fr",
        base_url="https://api.emploi-store.fr",
        client_id=os.getenv("CDB_PE_CLIENT_ID", ""),
        client_secret=os.getenv("CDB_PE_CLIENT_SECRET", ""),
        scope="api_referentielagencesv1 organisationpe",
    )

    agences = client.recherche_agences_pydantic("72", horaire=True, zonecompetence=True)

    print(agences)


if __name__ == "__main__":
    asyncio.run(main())
