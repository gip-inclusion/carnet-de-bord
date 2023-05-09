from typing import List
from uuid import UUID

from gql import gql
from pydantic import BaseModel


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
