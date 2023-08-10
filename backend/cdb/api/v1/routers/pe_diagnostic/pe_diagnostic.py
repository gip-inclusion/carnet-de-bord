from __future__ import annotations

import logging
from typing import Awaitable, Callable, List, Tuple
from uuid import UUID

from cdb.api.core.settings import settings
from cdb.api.db.models.ref_situation import RefSituation
from cdb.api.domain.contraintes import FocusDifferences, diff_contraintes
from cdb.api.domain.situations import SituationDifferences, diff_situations
from cdb.api.v1.routers.pe_diagnostic.pe_diagnostic_models import Notebook
from cdb.pe.models.dossier_individu_api import DossierIndividuData
from mypy_extensions import Arg
from pydantic import BaseModel

logger = logging.getLogger(__name__)


class Response(BaseModel):
    data_has_been_updated: bool = False
    external_data_has_been_updated: bool = False
    has_pe_diagnostic: bool = False


class IO(BaseModel):
    find_notebook: Callable[[UUID], Awaitable[Notebook | None]]
    get_dossier_pe: Callable[
        [Arg(str, "nir"), Arg(str, "birth_date")], Awaitable[DossierIndividuData | None]
    ]
    update_diagnostic_fetch_date: Callable[[UUID], Awaitable[None]]
    save_in_external_data: Callable[
        [DossierIndividuData, Arg(UUID, "beneficiary_id")], Awaitable[None]
    ]
    get_ref_situations: Callable[[], Awaitable[List[RefSituation]]]
    save_differences: Callable[
        [SituationDifferences, FocusDifferences, Arg(UUID, "notebook_id")],
        Awaitable[None],
    ]


DEPLOYMENT_CONFIG_ENABLE_PE_DIAGNOSTIC_API = "enable_pe_diagnostic_api"


async def update_notebook_from_pole_emploi(
    io: IO, notebook_id: UUID, dry_run: bool = False
) -> Response:
    response = Response()

    notebook: Notebook = await io.find_notebook(notebook_id)
    if not notebook:
        logger.error("id: %s - No notebook found", notebook_id)
        return response

    if not notebook.nir:
        logger.error("id: %s - No NIR for notebook", notebook_id)
        return response

    if not notebook.deployment_config.get(DEPLOYMENT_CONFIG_ENABLE_PE_DIAGNOSTIC_API):
        logger.error(
            "id: %s - PE diagnostic api not enabled for current notebook deployment",
            notebook_id,
        )
        return response

    response.has_pe_diagnostic = notebook.has_pe_diagnostic()
    if notebook.has_fresh_pe_data():
        logger.info(
            "id: %s - No fresh data for notebook, skipping",
            notebook_id,
        )
        return response

    # Connnect to the Pôle emploi API
    dossier = await io.get_dossier_pe(notebook.nir, notebook.date_of_birth)
    await io.update_diagnostic_fetch_date(notebook_id)

    # TODO: Quand on a un dossier qui nous revient à None
    #  alors qu'on avait des données on en fait rien,
    #  on ne devrait pas supprimer ?
    if dossier is None:
        logger.error(
            "id: %s - No PE dossier found for nir '%s' and date of birth '%s",
            notebook_id,
            notebook.nir,
            notebook.date_of_birth,
        )
        return response

    if notebook.last_diagnostic_hash == dossier.hash():
        logger.info(
            "id: %s - Last diagnostic is the same than PE, skipping",
            notebook_id,
        )
        return response

    if not dry_run:
        await io.save_in_external_data(dossier, notebook.beneficiary_id)

    response.has_pe_diagnostic = True
    response.external_data_has_been_updated = True

    if not settings.ENABLE_SYNC_CONTRAINTES:
        logger.info(
            "id: %s - ENABLE_SYNC_CONTRAINTES flag to false, skipping sync",
            notebook_id,
        )
        return response

    # Get Cdb situation repository from Graphql
    ref_situations = await io.get_ref_situations()

    situation_differences, focus_differences = await compare(
        dossier, notebook, ref_situations
    )

    if (
        situation_differences.situations_to_add
        or situation_differences.situations_to_delete
        or focus_differences.focuses_to_add
        or focus_differences.focus_ids_to_delete
        or focus_differences.target_differences.targets_to_add
        or focus_differences.target_differences.target_ids_to_end
        or focus_differences.target_differences.target_ids_to_cancel
    ) and not dry_run:
        await io.save_differences(situation_differences, focus_differences, notebook_id)
        response.data_has_been_updated = True

    return response


async def compare(
    dossier: DossierIndividuData, notebook: Notebook, ref_situations: List[RefSituation]
) -> Tuple[SituationDifferences, FocusDifferences]:
    situation_differences: SituationDifferences = diff_situations(
        dossier.contraintesIndividusDto.contraintes,
        ref_situations,
        notebook.situations,
    )
    contraintes_differences: FocusDifferences = diff_contraintes(
        contraintes=dossier.contraintesIndividusDto.contraintes,
        focuses=notebook.focuses,
    )
    return (situation_differences, contraintes_differences)
