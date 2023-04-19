import hashlib
import logging
import time
from datetime import date, timedelta
from typing import List, Tuple
from uuid import UUID

from cdb.api.core.emails import notify_manager_after_cafmsa_import
from cdb.api.core.exceptions import FindResultException
from cdb.api.db.graphql.beneficiary import (
    get_beneficiary_by_nir,
    update_beneficiary,
)
from cdb.api.db.graphql.get_client import gql_client_backend_only
from cdb.api.db.graphql.manager import (
    get_manager_by_account_id,
)
from cdb.caf_msa.parse_infos_foyer_rsa import (
    CafInfoFlux,
    CafMsaInfosFoyer,
    transform_cafMsaFoyer_to_beneficiary,
)


async def update_cafmsa_for_beneficiaries(
    account_id: UUID, jwt_token: str, data: Tuple[CafInfoFlux, List[CafMsaInfosFoyer]]
) -> None:
    infos, foyers = data
    count = 0
    count_error = 0
    count_success = 0
    start_time = time.time()

    async with gql_client_backend_only(token=jwt_token) as gql_session:
        for foyer in foyers:
            for personne in foyer.personnes:
                count += 1
                try:
                    beneficiary = await get_beneficiary_by_nir(
                        gql_session, personne.nir
                    )

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
                            count_error += 1
                            logging.error(
                                "échec de la mise à jour du bénéficiaire %s "
                                "caf/msa; %s",
                                beneficiary.id,
                                error,
                            )
                    else:
                        logging.info(
                            "beneficiary with matricule %s not found", foyer.matricule
                        )
                except Exception as error:
                    count_error += 1
                    logging.error(
                        "echec lors de la récupération du bénéficiaire "
                        "depuis le nir"
                        "%s",
                        error,
                    )

        logging.info(
            "Mise à jour de %s/%s dossiers (%s erreurs)",
            count_success,
            count,
            count_error,
        )

        manager = await get_manager_by_account_id(gql_session, account_id)
        duration = timedelta(seconds=time.time() - start_time)
        logging.info("Traitement des %s dossiers en %s", count, duration)
        if manager:
            logging.info(
                "Notification de la fin du traitement au manager %s",
                manager.email,
            )
            notify_manager_after_cafmsa_import(
                manager.email,
                date.today().strftime("%d/%m/%Y"),
                count,
                count_success,
                count_error,
            )
        else:
            raise FindResultException
