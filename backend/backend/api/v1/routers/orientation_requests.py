from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, Header
from fastapi.exceptions import HTTPException
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport
from pydantic import BaseModel

from backend.api.core.emails import Person, send_deny_orientation_request_email
from backend.api.core.settings import settings
from backend.api.db.models.role import RoleEnum
from backend.api.v1.dependencies import allowed_jwt_roles

router = APIRouter(
    dependencies=[
        Depends(
            allowed_jwt_roles(
                [
                    RoleEnum.ORIENTATION_MANAGER,
                ]
            )
        )
    ]
)


class DenyBeneficiaryOrientationInput(BaseModel):
    orientation_request_id: UUID

    def gql_variables(self):
        return {"id": str(self.orientation_request_id)}


deny_orientation_gql = gql(
    """
mutation DenyOrientationRequest($id: uuid!) {
orientation_request: update_orientation_request_by_pk(
    pk_columns: { id: $id }
    _set: { decidedAt: now, status: "denied" }
) {
    status
    decidedAt
    requestor {
    professional {
        email
    }
    }
    beneficiary {
    firstname
    lastname
    }
}
}
"""
)


@router.post("/deny")
async def deny_orientation_request(
    data: DenyBeneficiaryOrientationInput,
    background_tasks: BackgroundTasks,
    jwt_token: str | None = Header(default=None),
):
    """
    Deny an orientation request
    It will send an email to the requester to inform them about the decision
    """

    transport = AIOHTTPTransport(
        url=settings.graphql_api_url, headers={"Authorization": "Bearer " + jwt_token}
    )

    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:

        deny_response = await session.execute(
            deny_orientation_gql,
            variable_values=data.gql_variables(),
        )

        beneficiary = Person.parse_from_gql(
            deny_response["orientation_request"]["beneficiary"]
        )
        background_tasks.add_task(
            send_deny_orientation_request_email,
            to_email=deny_response["orientation_request"]["requestor"]["professional"][
                "email"
            ],
            beneficiary=beneficiary,
        )
