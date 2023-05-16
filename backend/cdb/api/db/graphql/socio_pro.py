from gql import gql

from cdb.api.v1.payloads.socio_pro import Input


def get_professional_project_common_gql_variables(professional_project):
    return {
        "contractTypeId": professional_project.contractTypeId,
        "employmentTypeId": professional_project.employmentTypeId,
        "hourlyRate": professional_project.hourlyRate,
        "mobilityRadius": professional_project.mobilityRadius,
        "romeCodeId": str(professional_project.romeCodeId)
        if professional_project.romeCodeId is not None
        else None,
    }


def get_professional_project_to_add_gql_variables(professional_project):
    return get_professional_project_common_gql_variables(professional_project) | {
        "notebookId": str(professional_project.notebookId),
    }


def get_situation_to_add_gql_variables(situation_to_add):
    return {
        "notebookId": str(situation_to_add.notebookId),
        "situationId": str(situation_to_add.situationId),
    }


def gql_variables(input: Input):
    return {
        "id": str(input.id),
        "workSituation": input.workSituation,
        "workSituationDate": input.workSituationDate,
        "workSituationEndDate": input.workSituationEndDate,
        "rightRqth": input.rightRqth,
        "educationLevel": input.educationLevel,
        "lastJobEndedAt": input.lastJobEndedAt,
        "professionalProjectIdsToDelete": [
            str(id) for id in input.professionalProjectIdsToDelete
        ],
        "professionalProjectsToAdd": [
            get_professional_project_to_add_gql_variables(p)
            for p in input.professionalProjectsToAdd
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
            for p in input.professionalProjectsToUpdate
        ],
        "situationsToAdd": [
            get_situation_to_add_gql_variables(s) for s in input.situationsToAdd
        ],
        "situationIdsToDelete": [str(id) for id in input.situationIdsToDelete],
    }


update_socio_pro_gql = gql(
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
