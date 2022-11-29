import logging
import os
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, Header
from fastapi.exceptions import HTTPException
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport
from pydantic import BaseModel

from api.core.emails import send_former_referent_email, send_new_referent_email
from api.core.init import connection
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

    def gql_variables_for_mutation(self) -> dict[str, str | bool]:
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

    def gql_variables_for_query(self) -> dict[str, str | bool]:

        return {
            "notebook_id": str(self.notebook_id),
            "structure_id": str(self.structure_id),
            "professional_account_id": str(self.professional_account_id),
        }


@router.post("/change-beneficiary-orientation")
async def change_beneficiary_orientation(
    data: ChangeBeneficiaryOrientationInput,
    background_tasks: BackgroundTasks,
    db=Depends(connection),
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

        notification_response = await session.execute(
            gql(get_infos_for_notification_query()),
            variable_values=data.gql_variables_for_query(),
        )

        if mutation is None:
            raise HTTPException(
                status_code=500,
                detail=f"Error while reading `{mutation_filename}` mutation file",
            )

        response = await session.execute(
            gql(mutation), variable_values=data.gql_variables_for_mutation()
        )
        for referent in notification_response["notebook_by_pk"]["former_referents"]:
            background_tasks.add_task(
                send_former_referent_email,
                email=referent["account"]["professional"]["email"],
            )

        for newReferent in notification_response["newReferent"]:
            background_tasks.add_task(
                send_new_referent_email,
                email=newReferent["email"],
            )

        return response


def load_mutation_from_file(filename: str):
    with open(os.path.join(os.path.dirname(__file__), filename), encoding="utf-8") as f:
        return f.read()


def get_infos_for_notification_query() -> str:
    return """
query notificationInfos($notebook_id:uuid!, $structure_id: uuid!, $professional_account_id:uuid) {
  notebook_by_pk(id: $notebook_id) {
  	beneficiary {
      firstname, lastname, address1, address2 postalCode city cafNumber
    }
    former_referents: members(where: {memberType: {_eq: "referent"} active: {_eq: true}}) {
      account { professional {
        firstname lastname
      	email, structure { name }
    	}}
    }
  }
  newStructure: structure_by_pk(id: $structure_id) {
    name
  }
  newReferent: professional(where: {account: {id: {_eq: $professional_account_id}}}) {
    email, firstname, lastname
}

}
    """
