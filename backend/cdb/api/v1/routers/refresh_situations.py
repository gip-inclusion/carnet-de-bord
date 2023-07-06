from __future__ import annotations

import abc
import json
import logging
from abc import ABC
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends
from gql.client import AsyncClientSession
from pydantic import BaseModel

from cdb.api.core.settings import settings
from cdb.api.db.crud.external_data import save_external_data_with_info
from cdb.api.db.crud.notebook_situation import (
    get_ref_situations_with_notebook_situations,
    save_notebook_situations,
)
from cdb.api.db.graphql.get_client import gql_client_backend_only
from cdb.api.db.models.external_data import ExternalSource
from cdb.api.domain.situation.situations import (
    SituationDifferences,
    merge_contraintes_to_situations,
)
from cdb.api.v1.dependencies import verify_secret_token
from cdb.api.v1.payloads.notebook import NotebookSituationInputPayload
from cdb.api.v1.payloads.socio_pro import SituationToAdd
from cdb.api.v1.routers.beneficiary_repository import (
    DbNotebookRepository,
)
from cdb.cdb_csv.json_encoder import CustomEncoder
from cdb.pe.models.dossier_individu_api import Contrainte, DossierIndividuData
from cdb.pe.pole_emploi_client import PoleEmploiApiClient

logger = logging.getLogger(__name__)

router = APIRouter(dependencies=[Depends(verify_secret_token)])

notebook_repository = DbNotebookRepository()


class DossierPEClient(ABC):
    class Query(BaseModel):
        nir: str
        birth_date: str

    @abc.abstractmethod
    async def find(self, query: DossierPEClient.Query) -> DossierIndividuData | None:
        pass


class RealDossierPEClient(DossierPEClient):
    async def find(self, query: DossierPEClient.Query) -> DossierIndividuData | None:
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
            ),
        )
        beneficiary = await pe_client.search_beneficiary(
            nir=query.nir, date_of_birth=query.birth_date
        )
        if beneficiary and beneficiary.identifiant:
            return await pe_client.get_dossier_individu(beneficiary.identifiant)


dossier_pe_client = RealDossierPEClient()


@router.post("/refresh-situations-from-pole-emploi", status_code=200)
async def refresh_notebook_situations_from_pole_emploi(
    payload: NotebookSituationInputPayload,
):
    """
    Cet endpoint est le backend de l'action Hasura
    qui permet de récupérer les situations dans le SI
    de Pôle-Emploi via les API dédiées.
    """
    if (
        not settings.ENABLE_SITUATION_API
        or settings.PE_CLIENT_ID == ""
        or settings.PE_CLIENT_SECRET == ""
    ):
        return {
            "data_has_been_updated": False,
            "external_data_has_been_updated": False,
            "has_pe_diagnostic": False,
        }

    notebook_id = payload.input.notebook_id

    notebook = await notebook_repository.find_by_notebook_id(notebook_id)
    if not notebook:
        return None
    if notebook.diagnostic_should_be_fetched():
        if not notebook.nir:
            return None

        dossier: DossierIndividuData | None = await dossier_pe_client.find(
            DossierPEClient.Query(nir=notebook.nir, birth_date=notebook.date_of_birth)
        )

        await notebook_repository.save_diagnostic_fetched_date(notebook_id)

        if dossier is None:
            return {
                "data_has_been_updated": False,
                "external_data_has_been_updated": False,
                "has_pe_diagnostic": False,
            }

        if notebook.last_diagnostic_hash == dossier.hash():
            return {
                "data_has_been_updated": False,
                "external_data_has_been_updated": False,
                "has_pe_diagnostic": True,
            }

        async with gql_client_backend_only() as session:
            await save_dossier(dossier, notebook.beneficiary_id, session)

            if settings.ENABLE_SYNC_CONTRAINTES:
                differences = await get_differences(
                    dossier.contraintesIndividusDto.contraintes, notebook_id, session
                )
                if differences.situations_to_add or differences.situations_to_delete:
                    await save_differences(differences, notebook_id, session)

                    return {
                        "data_has_been_updated": True,
                        "external_data_has_been_updated": True,
                        "has_pe_diagnostic": True,
                    }

        return {
            "data_has_been_updated": False,
            "external_data_has_been_updated": True,
            "has_pe_diagnostic": True,
        }
    return {
        "data_has_been_updated": False,
        "external_data_has_been_updated": False,
        "has_pe_diagnostic": notebook.has_pe_diagnostic(),
    }


async def save_dossier(
    dossier: DossierIndividuData, beneficiary_id: UUID, session: AsyncClientSession
):
    await save_external_data_with_info(
        session,
        beneficiary_id,
        dossier.jsonb(),
        ExternalSource.PE_IO,
    )


async def get_differences(
    contraintes: List[Contrainte], notebook_id: UUID, session
) -> SituationDifferences:
    (
        ref_situations,
        notebook_situations,
    ) = await get_ref_situations_with_notebook_situations(session, notebook_id)
    return merge_contraintes_to_situations(
        contraintes, ref_situations, notebook_situations
    )


async def save_differences(differences: SituationDifferences, notebook_id, session):
    await save_notebook_situations(
        session,
        notebook_id,
        [
            json.loads(
                json.dumps(
                    SituationToAdd(
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
