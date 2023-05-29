import logging
from uuid import UUID

from fastapi import APIRouter, Depends
from gql.dsl import DSLQuery, DSLSchema, dsl_gql
from pydantic import BaseModel

from cdb.api._gen.schema_gql import schema
from cdb.api.core.settings import settings
from cdb.api.db.crud.beneficiary import get_beneficiary_by_notebook_id_query
from cdb.api.db.graphql.get_client import gql_client_backend_only
from cdb.api.v1.dependencies import verify_secret_token
from cdb.pe.pole_emploi_client import PoleEmploiApiClient

logger = logging.getLogger(__name__)

router = APIRouter(dependencies=[Depends(verify_secret_token)])


class NotebookSituationInputPayload(BaseModel):
    nir: str
    date_of_birth: str


@router.get("/{notebook_id}/situations")
async def get_notebook_situations(
    notebook_id: UUID,
):
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
    dsl_schema = DSLSchema(schema=schema)
    query = get_beneficiary_by_notebook_id_query(
        dsl_schema=dsl_schema, notebook_id=notebook_id
    )
    async with gql_client_backend_only() as session:
        response = await session.execute(dsl_gql(DSLQuery(**query)))
        beneficiaries = response.get("beneficiaries")
        if isinstance(beneficiaries, list) and len(beneficiaries) > 0:
            beneficiary = beneficiaries[0]
            usager = await pole_emploi_client.search_beneficiary(
                nir=beneficiary["nir"],
                date_of_birth=beneficiary["dateOfBirth"],
            )
            if usager and usager.identifiant:
                contraintes = await pole_emploi_client.get_contraintes(
                    usager.identifiant
                )
                print(contraintes)
    return {}
