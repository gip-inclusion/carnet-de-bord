from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, Header
from gql import gql
from pydantic import BaseModel

from cdb.api.core.emails import Person, send_deny_orientation_request_email
from cdb.api.db.graphql.get_client import gql_client
from cdb.api.db.models.role import RoleEnum
from cdb.api.v1.dependencies import allowed_jwt_roles

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
    orientation_request_decision_reason: str | None

    def gql_variables(self):
        variables = {"id": str(self.orientation_request_id)}

        if self.orientation_request_decision_reason is not None:
            variables.update(
                {
                    "orientation_request_decision_reason": (
                        self.orientation_request_decision_reason
                    )
                }
            )

        return variables


deny_orientation_gql = gql(
    """
mutation DenyOrientationRequest(
  $id: uuid!,
  $orientation_request_decision_reason: String) {
orientation_request: update_orientation_request_by_pk(
    pk_columns: { id: $id }
    _set: {
      decidedAt: now,
      status: "denied",
      decisionReason: $orientation_request_decision_reason
    }
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
    authorization: str = Header(default=None),
):
    """
    Deny an orientation request
    It will send an email to the requester to inform them about the decision
    """

    async with gql_client(bearer_token=authorization) as session:
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
