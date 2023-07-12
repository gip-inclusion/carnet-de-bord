from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from typing import Awaitable, Callable, List
from uuid import UUID

from dateutil.parser import isoparse
from mypy_extensions import Arg
from pydantic import BaseModel

from cdb.api.core.settings import settings
from cdb.api.db.models.ref_situation import NotebookSituation, RefSituation
from cdb.api.domain.situations import (
    SituationDifferences,
    merge_contraintes_to_situations,
)
from cdb.pe.models.dossier_individu_api import DossierIndividuData

logger = logging.getLogger(__name__)


class Response(BaseModel):
    data_has_been_updated: bool = False
    external_data_has_been_updated: bool = False
    has_pe_diagnostic: bool = False


class GqlErrorResponse(BaseModel):
    class Error(BaseModel):
        message: str

    @staticmethod
    def single(message: str):
        return GqlErrorResponse(errors=[GqlErrorResponse.Error(message=message)])

    errors: List[GqlErrorResponse.Error]


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
        [SituationDifferences, Arg(UUID, "notebook_id")], Awaitable[None]
    ]


async def refresh_notebook_situations_from_pole_emploi(
    io: IO, notebook_id: UUID
) -> Response | GqlErrorResponse:
    if not settings.ENABLE_PEIO_API:
        return GqlErrorResponse.single("the situation api is disabled")

    notebook = await io.find_notebook(notebook_id)
    if not notebook:
        return GqlErrorResponse.single("the notebook was not found")

    if not notebook.nir:
        return GqlErrorResponse.single(
            "the notebook has no nir, it cannot be synced with pole emploi"
        )

    response = Response(has_pe_diagnostic=notebook.has_pe_diagnostic())
    if notebook.has_fresh_pe_data():
        return response

    dossier = await io.get_dossier_pe(notebook.nir, notebook.date_of_birth)
    await io.update_diagnostic_fetch_date(notebook_id)

    # TODO: Quand on a un dossier qui nous revient à None
    #  alors qu'on avait des données on en fait rien,
    #  on ne devrait pas supprimer ?
    if dossier is None:
        return response

    if notebook.last_diagnostic_hash == dossier.hash():
        return response

    await io.save_in_external_data(dossier, notebook.beneficiary_id)
    response.has_pe_diagnostic = True
    response.external_data_has_been_updated = True

    if not settings.ENABLE_SYNC_CONTRAINTES:
        return response

    ref_situations = await io.get_ref_situations()

    differences = await compare(dossier, notebook, ref_situations)
    if differences.situations_to_add or differences.situations_to_delete:
        await io.save_differences(differences, notebook_id)
        response.data_has_been_updated = True

    return response


class Notebook(BaseModel):
    diagnostic_fetched_at: str | None
    beneficiary_id: UUID
    nir: str | None
    date_of_birth: str
    last_diagnostic_hash: str | None
    situations: List[NotebookSituation]

    def has_fresh_pe_data(self) -> bool:
        if not self.diagnostic_fetched_at:
            return False
        creation_date = isoparse(self.diagnostic_fetched_at)
        expiry_date = creation_date + timedelta(hours=1)
        now = datetime.now(tz=timezone.utc)
        return now <= expiry_date

    def has_pe_diagnostic(self) -> bool:
        return self.last_diagnostic_hash is not None


async def compare(dossier, notebook, ref_situations):
    differences = merge_contraintes_to_situations(
        dossier.contraintesIndividusDto.contraintes, ref_situations, notebook.situations
    )
    return differences
