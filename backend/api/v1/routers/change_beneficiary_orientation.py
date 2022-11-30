import logging
import os
from datetime import datetime
from typing import Any
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, Header
from fastapi.exceptions import HTTPException
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport
from pydantic import BaseModel

from api.core.emails import send_orientation_referent_email
from api.core.settings import settings
from api.db.models.orientation_type import OrientationType
from api.db.models.role import RoleEnum
from api.v1.dependencies import allowed_jwt_roles

orientation_manager_only = allowed_jwt_roles([RoleEnum.ORIENTATION_MANAGER])
router = APIRouter(dependencies=[Depends(orientation_manager_only)])


logger = logging.getLogger(__name__)


class ChangeBeneficiaryOrientationInput(BaseModel):
    beneficiary_id: UUID
    notebook_id: UUID
    orientation_type: OrientationType
    structure_id: UUID
    orientation_request_id: UUID | None
    professional_account_id: UUID | None

    def gql_variables_for_mutation(self) -> dict[str, str | bool]:
        variables = (
            {"orientation_request_id": str(self.orientation_request_id)}
            if self.orientation_request_id
            else {}
        )
        return variables | {
            "orientation_type": str(self.orientation_type),
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
            "with_professional_account_id": self.professional_account_id is not None,
        }


@router.post("/change-beneficiary-orientation")
async def change_beneficiary_orientation(
    data: ChangeBeneficiaryOrientationInput,
    background_tasks: BackgroundTasks,
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

        mutation = load_gql_file(mutation_filename)

        notification_response = await session.execute(
            gql(load_gql_file("notificationInfo.gql")),
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

            kwargs = extract_email_kwargs(notification_response, referent, data)
            background_tasks.add_task(
                send_orientation_referent_email,
                email=referent["account"]["professional"]["email"],
                subject="Fin de suivi",
                template_path="former_notebook_member_email.html",
                **kwargs,
            )

        if "newReferent" in notification_response:
            for newReferent in notification_response["newReferent"]:
                pass

                # @TODO
                # kwargs = extract_email_kwargs(notification_response, referent, data))
                # background_tasks.add_task(
                # send_orientation_referent_email,
                # email=referent["account"]["professional"]["email"],
                # subject="Fin de suivi",
                # template_path="former_notebook_member_email.html",
                # **kwargs
                # )

        return response


def extract_email_kwargs(
    notification_response: dict,
    former_referent: dict,
    data: ChangeBeneficiaryOrientationInput,
) -> dict[str, Any]:

    new_referent_firstname = None
    new_referent_lastname = None
    if (
        "newReferent" in notification_response
        and len(notification_response["newReferent"]) > 0
    ):
        new_referent_firstname = notification_response["newReferent"][0]["firstname"]
        new_referent_lastname = notification_response["newReferent"][0]["lastname"]

    return {
        "beneficiary_firstname": notification_response["notebook_by_pk"]["beneficiary"][
            "firstname"
        ],
        "beneficiary_lastname": notification_response["notebook_by_pk"]["beneficiary"][
            "lastname"
        ],
        "old_referent_firstname": former_referent["account"]["professional"][
            "firstname"
        ],
        "old_referent_lastname": former_referent["account"]["professional"]["lastname"],
        "old_referent_structure": former_referent["account"]["professional"][
            "structure"
        ]["name"],
        "new_referent_firstname": new_referent_firstname,
        "new_referent_lastname": new_referent_lastname,
        "new_referent_structure": notification_response["newStructure"]["name"],
        "is_orientation_request": data.orientation_request_id is not None,
        "orientation_type": OrientationType.get_label(data.orientation_type),
        "orientation_date": datetime.now(),
    }


def load_gql_file(filename: str, path: str = os.path.dirname(__file__)):
    with open(os.path.join(path, filename), encoding="utf-8") as f:
        return f.read()
