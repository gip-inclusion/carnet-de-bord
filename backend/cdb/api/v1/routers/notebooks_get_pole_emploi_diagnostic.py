import logging

from fastapi import APIRouter, Depends

from cdb.api.db.models.role import RoleEnum
from cdb.api.v1.dependencies import allowed_jwt_roles, extract_authentified_account

logger = logging.getLogger(__name__)


router = APIRouter(
    dependencies=[
        Depends(
            allowed_jwt_roles([RoleEnum.PROFESSIONAL, RoleEnum.ORIENTATION_MANAGER])
        ),
        Depends(extract_authentified_account),
    ]
)


@router.get("/{notebook_id}/pole-emploi-diagnostic")
async def get_notebook_pole_emploi_diagnostic():
    """
    Cette route d'API permet de récupérer le diagnostic professionnel réalisé
        par Pôle-Emploi.
    Le diagnostic professionnel est lu directement dans le SI de Pôle-Emploi
        via les API dédiées.
    """
