import logging

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from cdb.api.core.settings import settings
from cdb.api.v1.dependencies import verify_secret_token
from cdb.pe.pole_emploi_client import PoleEmploiApiClient

logger = logging.getLogger(__name__)

router = APIRouter(dependencies=[Depends(verify_secret_token)])


class NotebookSituationInputPayload(BaseModel):
    nir: str
    date_of_birth: str


@router.get("/{notebook_id}/situations")
async def get_notebook_situations(input: NotebookSituationInputPayload):
    """
    Cette route d'API permet de récupérer les situations dans le SI
        de Pôle-Emploi via les API dédiées.
    """
    pole_emploi_client = PoleEmploiApiClient(
        auth_base_url=settings.PE_AUTH_BASE_URL,
        base_url=settings.PE_BASE_URL,
        client_id=settings.PE_CLIENT_ID,
        client_secret=settings.PE_CLIENT_SECRET,
        scope=settings.PE_SCOPE,
    )

    pole_emploi_client.search_beneficiary(
        nir=input.nir, date_of_birth=input.date_of_birth
    )
