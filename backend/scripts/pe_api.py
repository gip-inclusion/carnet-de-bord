import asyncio
import logging

from api.core.db import get_connection_pool
from api.core.settings import settings
from pe.pole_emploi_client import PoleEmploiApiClient

logging.basicConfig(level=logging.INFO)


async def main():

    client = PoleEmploiApiClient(
        auth_base_url="https://entreprise.pole-emploi.fr",
        base_url="https://api.emploi-store.fr",
        client_id="PAR_devcarnetdebord_eaf8a8f6cff6f9b7a6369b29ca6c3ddfde49a8ac54be45b3293f435bcf7f76eb",
        client_secret="15c4318b1015eea6c215b3f854bad4762b87240bf95fb23cb1a0d94ad97037e3",
        scope="api_referentielagencesv1 organisationpe",
    )

    agences = client.recherche_agences_pydantic("72", horaire=True, zonecompetence=True)

    print(agences)


if __name__ == "__main__":
    asyncio.run(main())
