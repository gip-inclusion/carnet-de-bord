import io
from typing import List

from gql.client import AsyncClientSession

from cdb.api.db.graphql.beneficiary import get_beneficiary_by_nir, update_beneficiary
from cdb.caf_msa.parse_infos_foyer_rsa import (
    CafMsaInfosFoyer,
    parse_caf_file,
    transform_cafMsaFoyer_to_beneficiary,
)


async def update_beneficiaries(
    gql_session: AsyncClientSession, file: io.BufferedReader
) -> None:
    foyers: List[CafMsaInfosFoyer] = parse_caf_file(file)

    for foyer in foyers:
        for personne in foyer.personnes:
            beneficiary = await get_beneficiary_by_nir(gql_session, personne.nir)
            if beneficiary:
                beneficiary_update = transform_cafMsaFoyer_to_beneficiary(
                    personne, foyer
                )
                await update_beneficiary(
                    gql_session, beneficiary.id, beneficiary_update
                )
