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
    orientation_request_id: UUID | None
    orientation_type: str
    notebook_id: UUID
    beneficiary_id: UUID
    structure_id: UUID
    professional_account_id: UUID | None

    def gql_variables(self):
        variables = (
            {"orientation_request_id": str(self.orientation_request_id)}
            if self.orientation_request_id
            else {}
        )
        return variables | {
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

    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:
        mutation_filename = (
            "_changeBeneficiaryOrientation.gql"
            if data.orientation_request_id is None
            else "_acceptOrientationRequest.gql"
        )

        mutation = load_mutation_from_file(mutation_filename)

        if mutation is None:
            raise HTTPException(
                status_code=500,
                detail="Error while reading `" + mutation_filename + "` mutation file",
            )

        return await session.execute(
            gql(mutation), variable_values=data.gql_variables()
        )


def load_mutation_from_file(filename: str):
    with open(os.path.join(os.path.dirname(__file__), filename), encoding="utf-8") as f:
        return f.read()
