from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel

from cdb.api.v1.payloads.hasura_action import HasuraActionPayload


class ProfessionalProjectCommon(BaseModel):
    contractTypeId: str | None
    employmentTypeId: str | None
    hourlyRate: int | None
    mobilityRadius: int | None
    romeCodeId: UUID | None


class ProfessionalProjectToAdd(ProfessionalProjectCommon):
    notebookId: UUID


class ProfessionalProjectToUpdate(ProfessionalProjectCommon):
    id: UUID


class SituationInsertInput(BaseModel):
    notebookId: UUID
    situationId: UUID
    createdAt: datetime | None = None


class Input(BaseModel):
    educationLevel: str | None
    id: UUID
    lastJobEndedAt: str | None
    professionalProjectIdsToDelete: List[UUID]
    professionalProjectsToAdd: List[ProfessionalProjectToAdd]
    professionalProjectsToUpdate: List[ProfessionalProjectToUpdate]
    rightRqth: bool
    situationIdsToDelete: List[UUID]
    situationsToAdd: List[SituationInsertInput]
    workSituation: str | None
    workSituationDate: str | None
    workSituationEndDate: str | None


class UpdateSocioProActionPayload(HasuraActionPayload):
    input: Input
