from __future__ import annotations

import json
import logging
from uuid import UUID

from gql import gql

from cdb.api.core.settings import settings
from cdb.api.db.crud.beneficiary import update_diagnostic_fetch_date_gql
from cdb.api.db.crud.external_data import save_external_data_with_info
from cdb.api.db.crud.notebook_focus import add_remove_notebook_focuses
from cdb.api.db.crud.notebook_situation import (
    save_notebook_situations,
)
from cdb.api.db.models.external_data import ExternalSource
from cdb.api.db.models.ref_situation import NotebookSituation
from cdb.api.domain.contraintes import FocusDifferences
from cdb.api.domain.situations import (
    SituationDifferences,
)
from cdb.api.v1.payloads.socio_pro import SituationInsertInput
from cdb.api.v1.routers.pe_diagnostic.pe_diagnostic_models import (
    Focus,
    Notebook,
)
from cdb.cdb_csv.json_encoder import CustomEncoder
from cdb.pe.models.dossier_individu_api import DossierIndividuData
from cdb.pe.pole_emploi_client import PoleEmploiApiClient

logger = logging.getLogger(__name__)


async def find_notebook(session, notebook_id) -> Notebook | None:
    response = await session.execute(
        gql(
            """
            query GetBeneficiaryQuery($notebook_id:uuid!) {
                notebook_by_pk(id: $notebook_id) {
                    beneficiary {
                        id nir dateOfBirth
                        externalDataInfos(where: {
                            externalData: { source: { _eq: peio } } }
                            order_by: { created_at: desc }
                            limit: 1
                        ) {
                            externalData { hash }
                        }
                    }
                    diagnosticFetchedAt
                    situations { id situationId createdAt deletedAt }
                    focuses {
                        id
                        theme
                        created_at: createdAt
                        targets(where: {status: {_eq: "in_progress"}}) {
                            id target
                        }
                    }
                }
            }
            """
        ),
        {"notebook_id": notebook_id},
    )
    notebook = response["notebook_by_pk"]
    if not notebook:
        return None
    infos = notebook["beneficiary"]["externalDataInfos"]
    external_data_hash = None
    if isinstance(infos, list) and len(infos) == 1:
        info = infos[0]
        external_data_hash = info["externalData"]["hash"]
    return Notebook(
        diagnostic_fetched_at=notebook["diagnosticFetchedAt"],
        beneficiary_id=notebook["beneficiary"]["id"],
        nir=notebook["beneficiary"]["nir"],
        date_of_birth=notebook["beneficiary"]["dateOfBirth"],
        last_diagnostic_hash=external_data_hash,
        situations=[
            NotebookSituation.parse_obj(situation)
            for situation in notebook["situations"]
        ],
        focuses=[Focus.parse_obj(focus) for focus in notebook["focuses"]],
    )


async def get_dossier_pe(nir: str, birth_date: str):
    pe_client = PoleEmploiApiClient(
        auth_base_url=settings.PE_AUTH_BASE_URL,
        base_url=settings.PE_BASE_URL,
        client_id=settings.PE_CLIENT_ID,
        client_secret=settings.PE_CLIENT_SECRET,
        scope=" ".join(
            [
                "api_rechercher-usagerv1",
                "api_diagnosticargumentev1",
            ]
        ),  # noqa: E501
    )
    beneficiary = await pe_client.search_beneficiary(nir=nir, date_of_birth=birth_date)
    if beneficiary and beneficiary.identifiant:
        return await pe_client.get_dossier_individu(beneficiary.identifiant)


async def update_diagnostic_fetch_date(session, notebook_id):
    await session.execute(
        update_diagnostic_fetch_date_gql(), {"notebook_id": notebook_id}
    )


async def save_in_external_data(
    session, dossier: DossierIndividuData, beneficiary_id: UUID
):
    await save_external_data_with_info(
        session,
        beneficiary_id,
        dossier.jsonb(),
        ExternalSource.PE_IO,
    )


async def save_differences(
    session,
    differences: SituationDifferences,
    focus_differences: FocusDifferences,
    notebook_id: UUID,
):
    await save_notebook_situations(
        session,
        notebook_id,
        [
            json.loads(
                json.dumps(
                    SituationInsertInput(
                        notebookId=notebook_id,
                        situationId=situation.situation_id,
                        createdAt=situation.created_at,
                    ).dict(),
                    cls=CustomEncoder,
                )
            )
            for situation in differences.situations_to_add
        ],
        differences.situations_to_delete,
    )
    await add_remove_notebook_focuses(
        session, notebook_id=notebook_id, focus_differences=focus_differences
    )
