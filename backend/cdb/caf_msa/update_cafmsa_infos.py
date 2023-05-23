import hashlib
import logging
import time
from datetime import date, timedelta
from tempfile import SpooledTemporaryFile
from uuid import UUID

from gql.client import AsyncClientSession

from cdb.api.core.emails import notify_manager_after_cafmsa_import
from cdb.api.db.graphql.beneficiary import (
    BeneficiaryRsaInfos,
    get_beneficiary_by_nir,
    update_beneficiary,
)
from cdb.api.db.graphql.get_client import gql_client_backend_only
from cdb.api.db.graphql.manager import get_manager_by_account_id
from cdb.caf_msa.parse_infos_foyer_rsa import (
    CafBeneficiary,
    CafInfoFlux,
    CafMsaInfosFoyer,
    parse_caf_file,
    transform_cafMsaFoyer_to_beneficiary,
)

logger = logging.getLogger(__name__)


async def update_cafmsa_for_beneficiaries(
    account_id: UUID, authorization: str, file: SpooledTemporaryFile
) -> None:
    count = 0
    count_error = 0
    count_success = 0
    time_interval = 60 * 5
    infos: CafInfoFlux | None = None

    async with gql_client_backend_only(bearer_token=authorization) as session:
        start_time = time.time()
        last_time = time.time()
        try:
            parsed = parse_caf_file(file)
            maybe_infos = next(parsed)
            if not isinstance(maybe_infos, CafInfoFlux):
                raise CafXMLMissingNodeException

            infos = maybe_infos

            for node in parsed:
                if not isinstance(node, CafMsaInfosFoyer) or not infos:
                    raise CafXMLMissingNodeException
                for beneficiary in node.beneficiaries:
                    if (time.time() - last_time) > time_interval:
                        logger.info(
                            "Traitement du fichier en cours "
                            "%s/%s dossiers traités (%s erreurs)",
                            count_success,
                            count,
                            count_error,
                        )
                        last_time = time.time()
                    try:
                        result = await save_cafmsa_infos_for_beneficiary(
                            gql_session=session,
                            flux_info=infos,
                            foyer=node,
                            caf_beneficiary=beneficiary,
                        )
                        if result:
                            count_success += 1
                    except Exception as error:
                        logger.error(
                            "Erreur lors du traitement du dossier %s",
                            error,
                        )
                        count_error += 1
                    finally:
                        count += 1

            logger.info(
                "Mise à jour de %s/%s dossiers reçus (%s erreurs) en %s",
                count_success,
                count,
                count_error,
                timedelta(seconds=time.time() - start_time),
            )

            manager = await get_manager_by_account_id(session, account_id)
            if manager:
                logger.info(
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
                logger.warning(
                    "manager (id=%s) introuvable",
                    account_id,
                )
        except Exception as error:
            logger.error(error)


async def save_cafmsa_infos_for_beneficiary(
    gql_session: AsyncClientSession,
    flux_info: CafInfoFlux,
    foyer: CafMsaInfosFoyer,
    caf_beneficiary: CafBeneficiary,
) -> BeneficiaryRsaInfos | None:
    beneficiary = await get_beneficiary_by_nir(gql_session, caf_beneficiary.nir)

    if beneficiary:
        beneficiary_update = transform_cafMsaFoyer_to_beneficiary(
            caf_beneficiary, foyer
        )
        external_data_to_save = {
            "flux": flux_info.dict(),
            "foyer": foyer.dict(),
        }
        sha = hashlib.sha256(str(external_data_to_save).encode()).hexdigest()

        return await update_beneficiary(
            gql_session,
            beneficiary.id,
            beneficiary_update,
            sha,
            external_data_to_save,
        )
    else:
        logging.warning("truc", caf_beneficiary.nir)


class CafXMLMissingNodeException(Exception):
    """
    utility class when some node in xml are missing
    """
