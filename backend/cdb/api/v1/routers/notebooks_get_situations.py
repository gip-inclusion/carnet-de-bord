import logging
from uuid import UUID

from asyncpg import Connection
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
async def get_notebook_situations(
    db_connection: Connection,
    notebook_id: UUID,
):
    """
    Cette route d'API permet de récupérer les situations dans le SI
        de Pôle-Emploi via les API dédiées.
    """
    PoleEmploiApiClient(
        auth_base_url=settings.PE_AUTH_BASE_URL,
        base_url=settings.PE_BASE_URL,
        client_id=settings.PE_CLIENT_ID,
        client_secret=settings.PE_CLIENT_SECRET,
        scope=settings.PE_SCOPE,
    )

    # TODO: Find beneficiary from notebook_id


#    beneficiary = Beneficiary()
#
#    pole_emploi_client.search_beneficiary(
#        nir=beneficiary.nir,
#        date_of_birth=beneficiary.date_of_birth,
#    )
