import logging
import os
from uuid import UUID

from fastapi import APIRouter, Depends, Header
from fastapi.exceptions import HTTPException
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport
from pydantic import BaseModel

from api.core.settings import settings
from api.db.models.role import RoleEnum
from api.v1.dependencies import allowed_jwt_roles

orientation_manager_only = allowed_jwt_roles([RoleEnum.ORIENTATION_MANAGER])
router = APIRouter(dependencies=[Depends(orientation_manager_only)])

logger = logging.getLogger(__name__)


class ChangeBeneficiaryOrientationInput(BaseModel):
    orientation_type: str
    notebook_id: UUID
    beneficiary_id: UUID
    structure_id: UUID
    professional_account_id: UUID | None

    def gql_variables(self):
        return {
            "orientation_type": self.orientation_type,
            "notebook_id": str(self.notebook_id),
            "beneficiary_id": str(self.beneficiary_id),
            "structure_id": str(self.structure_id),
            "professional_account_id": str(self.professional_account_id),
            "with_professional_account_id": self.professional_account_id is not None,
        }


@router.post("/change-beneficiary-orientation")
async def change_beneficiary_orientation(
    data: ChangeBeneficiaryOrientationInput,
    jwt_token: str | None = Header(default=None),
):
    if not jwt_token:
        raise HTTPException(status_code=401, detail="unauthorized")

    transport = AIOHTTPTransport(
        url=settings.graphql_api_url, headers={"Authorization": "Bearer " + jwt_token}
    )

    # Add a background task with these parameter to send 3 email
    # get beneficiary firstname / lastname
    # get previous referent firstname, lastname, email
    # get previous referent's structure
    # get previous referent's structure admin email / firstname / lastname
    # get new referent firstname, lastname email
    # get new referent's structure admin email / firstname / lastname

    # Using `async with` on the client will start a connection on the transport
    # and provide a `session` variable to execute queries on this connection
    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:
        change_orientation_mutation = ""
        with open(
            os.path.join(
                os.path.dirname(__file__), "_changeBeneficiaryOrientation.gql"
            ),
            encoding="utf-8",
        ) as f:
            change_orientation_mutation = f.read()
        if change_orientation_mutation:
            # Execute single query
            query = gql(change_orientation_mutation)

            result = await session.execute(query, variable_values=data.gql_variables())
            logger.info(result)

            return result
        else:
            raise HTTPException(status_code=500, detail="Pb de lecture du fichier")
