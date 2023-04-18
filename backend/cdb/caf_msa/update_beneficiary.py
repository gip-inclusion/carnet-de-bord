import hashlib
import io
import logging
from datetime import date
from typing import List, Tuple
from uuid import UUID

from cdb.api.core.emails import notify_manager_after_cafmsa_import
from cdb.api.core.exceptions import FindResultException
from cdb.api.core.settings import settings
from cdb.api.db.graphql.beneficiary import get_beneficiary_by_nir, update_beneficiary
from cdb.api.db.graphql.get_client import gql_client
from cdb.api.db.graphql.manager import get_manager_by_account_id
from cdb.caf_msa.parse_infos_foyer_rsa import (
    CafInfoFlux,
    CafMsaInfosFoyer,
    parse_caf_file,
    transform_cafMsaFoyer_to_beneficiary,
)


async def update_beneficiaries_from_cafmsa(
    account_id: UUID, jwt_token: str, file: io.BufferedReader
) -> None:
    data: Tuple[CafInfoFlux, List[CafMsaInfosFoyer]] = parse_caf_file(file)
    infos, foyers = data
    count = 0
    count_error = 0
    count_success = 0
    async with await gql_client(
        url=settings.graphql_api_url,
        headers={
            "x-hasura-admin-secret": settings.hasura_graphql_admin_secret,
            "x-hasura-use-backend-only-permissions": "true",
            "Authorization": "Bearer " + jwt_token,
        },
    ) as gql_session:
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

                except Exception as error:
                    count_error += 1
                    logging.error(
                        "echec lors de la récupération du bénéficiaire "
                        "depuis le nir %s",
                        error,
                    )

        manager_email = await get_manager_by_account_id(gql_session, account_id)
        if manager_email:
            notify_manager_after_cafmsa_import(
                manager_email.email,
                date.today().strftime("%d/%m/%Y"),
                count,
                count_success,
                count_error,
            )
        else:
            raise FindResultException
