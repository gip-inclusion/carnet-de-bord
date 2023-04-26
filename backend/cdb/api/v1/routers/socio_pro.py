from typing import Annotated, List
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Request
from pydantic import BaseModel, Field

from cdb.api.core.init import connection
from cdb.api.v1.dependencies import verify_secret_token

router = APIRouter(dependencies=[Depends(verify_secret_token)])


class Action(BaseModel):
    name: str


class ProfessionalProjectCommon(BaseModel):
    contractTypeId: str | None
    employmentTypeId: str | None
    hourlyRate: str | None
    mobilityRadius: str | None
    romeCodeId: UUID | None


class ProfessionalProjectToAdd(ProfessionalProjectCommon):
    notebookId: UUID


class ProfessionalProjectToUpdate(ProfessionalProjectCommon):
    id: UUID


class SituationsToAdd(BaseModel):
    notebookId: UUID
    situationId: UUID


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
    x_hasura_professional_id: str = Field(..., alias="x-hasura-professional-id")
    x_hasura_role: str = Field(..., alias="x-hasura-role")
    x_hasura_structure_id: str = Field(..., alias="x-hasura-structure-id")
    x_hasura_user_id: str = Field(..., alias="x-hasura-user-id")


class UpdateSocioProMutation(BaseModel):
    action: Action
    input: Input
    request_query: str
    session_variables: SessionVariables


@router.post("/update")
async def update(
    request: Request,
    mutation: UpdateSocioProMutation,
    authorization: Annotated[str | None, Header()] = None,
    db=Depends(connection),
):
    print(authorization)
    print(mutation)
