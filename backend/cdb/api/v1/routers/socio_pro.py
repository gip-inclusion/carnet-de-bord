from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Depends, Header
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport
from pydantic import BaseModel, Field

from cdb.api.core.settings import settings
from cdb.api.v1.dependencies import verify_secret_token

router = APIRouter(dependencies=[Depends(verify_secret_token)])


class Action(BaseModel):
    name: str


class ProfessionalProjectCommon(BaseModel):
    contractTypeId: str | None
    employmentTypeId: str | None
    hourlyRate: int | None
    mobilityRadius: int | None
    romeCodeId: UUID | None

    def gql_variables(self):
        return {
            "contractTypeId": self.contractTypeId,
            "employmentTypeId": self.employmentTypeId,
            "hourlyRate": self.hourlyRate,
            "mobilityRadius": self.mobilityRadius,
            "romeCodeId": str(self.romeCodeId) if self.romeCodeId is not None else None,
        }


class ProfessionalProjectToAdd(ProfessionalProjectCommon):
    notebookId: UUID

    def gql_variables(self):
        return super().gql_variables() | {
            "notebookId": str(self.notebookId),
        }


class ProfessionalProjectToUpdate(ProfessionalProjectCommon):
    id: UUID

    def gql_variables(self):
        return super().gql_variables() | {
            "id": str(self.id),
        }


class SituationsToAdd(BaseModel):
    notebookId: UUID
    situationId: UUID

    def gql_variables(self):
        return {
            "notebookId": str(self.notebookId),
            "situationId": str(self.situationId),
        }


class Input(BaseModel):
    educationLevel: str | None
    id: UUID
    lastJobEndedAt: str | None
    professionalProjectIdsToDelete: List[UUID]
    professionalProjectsToAdd: List[ProfessionalProjectToAdd]
    professionalProjectsToUpdate: List[ProfessionalProjectToUpdate]
    rightRqth: bool | None
    situationIdsToDelete: List[UUID]
    situationsToAdd: List[SituationsToAdd]
    workSituation: str | None
    workSituationDate: str | None
    workSituationEndDate: str | None


class SessionVariables(BaseModel):
    x_hasura_deployment_id: str = Field(..., alias="x-hasura-deployment-id")
    x_hasura_role: str = Field(..., alias="x-hasura-role")
    x_hasura_user_id: str = Field(..., alias="x-hasura-user-id")


def remove_none_from_dict(dictionary):
    for key, value in list(dictionary.items()):
        if value is None:
            del dictionary[key]
        elif isinstance(value, dict):
            remove_none_from_dict(value)
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, dict):
                    remove_none_from_dict(item)

    return dictionary


class UpdateSocioProMutation(BaseModel):
    action: Action
    input: Input
    request_query: str
    session_variables: SessionVariables

    def gql_variables(self):
        return {
            "id": str(self.input.id),
            "workSituation": self.input.workSituation,
            "workSituationDate": self.input.workSituationDate,
            "workSituationEndDate": self.input.workSituationEndDate,
            "rightRqth": self.input.rightRqth,
            "educationLevel": self.input.educationLevel,
            "lastJobEndedAt": self.input.lastJobEndedAt,
            "professionalProjectIdsToDelete": [
                str(id) for id in self.input.professionalProjectIdsToDelete
            ],
            "professionalProjectsToAdd": [
                p.gql_variables() for p in self.input.professionalProjectsToAdd
            ],
            "professionalProjectsToUpdate": [
                {
                    "where": {
                        "id": {"_eq": p.id},
                    },
                    "_set": {
                        "mobilityRadius": p.mobilityRadius,
                        "romeCodeId": p.romeCodeId,
                        "contractTypeId": p.contractTypeId,
                        "employmentTypeId": p.employmentTypeId,
                        "hourlyRate": p.hourlyRate,
                    },
                }
                for p in self.input.professionalProjectsToUpdate
            ],
            "situationsToAdd": [p.gql_variables() for p in self.input.situationsToAdd],
            "situationIdsToDelete": [str(id) for id in self.input.situationIdsToDelete],
        }


deny_orientation_gql = gql(
    """
mutation UpdateSocioPro(
  $id: uuid!
  $workSituation: String
  $workSituationDate: date
  $workSituationEndDate: date
  $rightRqth: Boolean
  $educationLevel: String
  $lastJobEndedAt: date
  $professionalProjectIdsToDelete: [uuid!]!
  $professionalProjectsToAdd: [professional_project_insert_input!]!
  $professionalProjectsToUpdate: [professional_project_updates!]!
  $situationsToAdd: [notebook_situation_insert_input!]!
  $situationIdsToDelete: [uuid!]!
) {
  update: update_notebook_by_pk(
    pk_columns: { id: $id }
    _set: {
      workSituation: $workSituation
      workSituationDate: $workSituationDate
      workSituationEndDate: $workSituationEndDate
      rightRqth: $rightRqth
      educationLevel: $educationLevel
      lastJobEndedAt: $lastJobEndedAt
    }
  ) {
    id
  }
  delete_professional_project(where: { id: { _in: $professionalProjectIdsToDelete } }) {
    affected_rows
  }
  update_professional_project_many(updates: $professionalProjectsToUpdate) {
    affected_rows
  }
  insert_professional_project(objects: $professionalProjectsToAdd) {
    affected_rows
  }
  update_notebook_situation(
    where: {
      _and: [
        { notebookId: { _eq: $id } }
        { situationId: { _in: $situationIdsToDelete } }
        { deletedAt: { _is_null: true } }
      ]
    }
  ) {
    affected_rows
  }
  insert_notebook_situation(objects: $situationsToAdd) {
    affected_rows
  }
}
"""
)


@router.post("/update")
async def update(
    mutation: UpdateSocioProMutation,
    authorization: Annotated[str | None, Header()] = None,
):
    """
    Update the socio pro information of a notebook.
    It will create a notebook_event that will keep track of the modifications performed
    """

    transport = AIOHTTPTransport(
        url=settings.graphql_api_url,
        headers={
            "Authorization": authorization,
            "x-hasura-use-backend-only-permissions": "true",
            "x-hasura-admin-secret": settings.hasura_graphql_admin_secret,
        },
    )

    async with Client(
        transport=transport, fetch_schema_from_transport=False, serialize_variables=True
    ) as session:
        variables = remove_none_from_dict(mutation.gql_variables())

        await session.execute(
            deny_orientation_gql,
            variable_values=variables,
        )
