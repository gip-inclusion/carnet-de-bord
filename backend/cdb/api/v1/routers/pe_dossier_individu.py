import logging

from fastapi import APIRouter, Depends
from gql import gql

from cdb.api.db.graphql.get_client import gql_client_backend_only
from cdb.api.v1.dependencies import verify_secret_token
from cdb.api.v1.payloads.notebook import NotebookInputPayload
from cdb.pe.models.dossier_individu_api import DossierIndividuData

logger = logging.getLogger(__name__)

router = APIRouter(dependencies=[Depends(verify_secret_token)])


@router.post(
    "/dossier-individu-pole-emploi",
    status_code=200,
    response_model=DossierIndividuData | None,
)
async def dossier_individu_pole_emploi(
    payload: NotebookInputPayload,
):
    """
    Cet endpoint est le backend de l'action Hasura
    qui permet de récupérer le dossier individu pole emploi
    stocké dans la table external data.
    """
    async with gql_client_backend_only() as session:
        result = await session.execute(
            gql(
                """
                query($notebookId: uuid!) {
                    external_data(
                        limit:1
                        order_by: {updated_at: desc}
                        where:{
                            source: {_eq: peio}
                            externalDataInfo: {
                                beneficiary: {notebook: {id: {_eq: $notebookId}}}
                            }
                        }
                    ) {
                        data
                        updated_at
                    }
                }
            """
            ),
            {"notebookId": payload.input.notebook_id},
        )

        if len(result["external_data"]) > 0:
            return result["external_data"][0]["data"]

    return None
