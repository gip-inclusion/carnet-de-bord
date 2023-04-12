import hashlib
import io
import logging
from typing import List, Tuple

from gql.client import AsyncClientSession

from cdb.api.db.graphql.beneficiary import get_beneficiary_by_nir, update_beneficiary
from cdb.caf_msa.parse_infos_foyer_rsa import (
    CafInfoFlux,
    CafMsaInfosFoyer,
    parse_caf_file,
    transform_cafMsaFoyer_to_beneficiary,
)


async def update_beneficiaries(
    gql_session: AsyncClientSession, file: io.BufferedReader
) -> dict[str, int]:
    data: Tuple[CafInfoFlux, List[CafMsaInfosFoyer]] = parse_caf_file(file)
    infos, foyers = data
    count = 0
    count_success = 0
    for foyer in foyers:
        for personne in foyer.personnes:
            count += 1
            try:
                beneficiary = await get_beneficiary_by_nir(gql_session, personne.nir)
                if beneficiary:
                    beneficiary_update = transform_cafMsaFoyer_to_beneficiary(
                        personne, foyer
                    )
                    external_data_to_save = {
                        "flux": infos.dict(),
                        "foyer": foyer.dict(),
                    }
                    sha = hashlib.sha256(str(data).encode()).hexdigest()
                    try:
                        await update_beneficiary(
                            gql_session,
                            beneficiary.id,
                            beneficiary_update,
                            sha,
                            external_data_to_save,
                        )
                        count_success += 1
                    except Exception as error:
                        logging.error(
                            "fail to update beneficiary %s caf/msa data %s",
                            beneficiary.id,
                            error,
                        )
            except Exception as error:
                logging.error("fail to get beneficiary by nir %s", error)
    return {"nb_file": count, "nb_success": count_success}
