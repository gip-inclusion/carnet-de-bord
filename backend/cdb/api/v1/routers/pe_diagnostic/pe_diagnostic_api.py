from __future__ import annotations

import logging
from functools import partial

from fastapi import APIRouter, Depends

from cdb.api.db.crud.notebook_situation import (
    get_ref_situations,
)
from cdb.api.db.graphql.get_client import gql_client_backend_only
from cdb.api.v1.dependencies import verify_secret_token
from cdb.api.v1.payloads.notebook import NotebookInputPayload
from cdb.api.v1.routers.pe_diagnostic.pe_diagnostic import (
    IO,
    update_notebook_from_pole_emploi,
)
from cdb.api.v1.routers.pe_diagnostic.pe_diagnostic_io import (
    find_notebook,
    get_dossier_pe,
    save_differences,
    save_in_external_data,
    update_diagnostic_fetch_date,
)

logger = logging.getLogger(__name__)

router = APIRouter(dependencies=[Depends(verify_secret_token)])


@router.post("/update-notebook-from-pole-emploi", status_code=200)
async def api_update_notebook_from_pole_emploi(
    payload: NotebookInputPayload,
):
    """
    Cet endpoint est le backend de l'action Hasura
    qui permet de récupérer les situations dans le SI
    de Pôle-Emploi via les API dédiées.
    """

    notebook_id = payload.input.notebook_id

    async with gql_client_backend_only() as session:
        IO.update_forward_refs()
        deps = IO(
            find_notebook=partial(find_notebook, session),
            get_dossier_pe=get_dossier_pe,
            update_diagnostic_fetch_date=partial(update_diagnostic_fetch_date, session),
            save_in_external_data=partial(save_in_external_data, session),
            get_ref_situations=partial(get_ref_situations, session),
            save_differences=partial(save_differences, session),
        )
        return await update_notebook_from_pole_emploi(deps, notebook_id)
