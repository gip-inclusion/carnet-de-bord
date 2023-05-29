import asyncio
import json
import logging
import os

from cdb.api.core.settings import settings
from cdb.pe.pole_emploi_client import PoleEmploiApiClient

logging.basicConfig(level=logging.INFO, format=settings.LOG_FORMAT)

"""
    Script qui récupère toutes les agences / relais pôle emploi d'un département
    et sort le résultat en json
    Couplé à jq, on peut ainsi facilement récupérer un json avec le code safir et le
    libellé du département 08
    ex
    ```
    DEPARTEMENT=08 poetry run python scripts/pe_api.py |\
        jq '.[] | {codeSafir: .codeSafir, libelle:.libelleEtendu}'
    ```
    on peut aussi récupérer tous les libellés étendus du département 08
    DEPARTEMENT=08 poetry run python scripts/pe_api.py | jq '.[].libelleEtendu'
"""


async def main():

    client = PoleEmploiApiClient(
        auth_base_url=settings.PE_AUTH_BASE_URL,
        base_url=settings.PE_BASE_URL,
        client_id=settings.PE_CLIENT_ID,
        client_secret=settings.PE_CLIENT_SECRET,
        scope=settings.PE_SCOPE,
    )

    agences = await client.recherche_agences(os.getenv("DEPARTEMENT") or "26")

    print(json.dumps([agence.dict() for agence in agences], indent=2))


if __name__ == "__main__":
    asyncio.run(main())
