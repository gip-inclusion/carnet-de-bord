from uuid import UUID

from pydantic import BaseModel, Field

from cdb.api.v1.payloads.hasura_action import HasuraActionPayload


class CreateNotebookTargetInput(BaseModel):
    focus_id: UUID = Field(alias="focusId")
    target: str


class CreateNotebookTargetActionPayload(HasuraActionPayload):
    input: CreateNotebookTargetInput


class UpdateNotebookTargetStatusInput(BaseModel):
    id: UUID
    status: str


class CreatedNotebookTarget(BaseModel):
    id: UUID


class UpdateNotebookTargetStatusActionPayload(HasuraActionPayload):
    input: UpdateNotebookTargetStatusInput


class UpdatedNotebookTarget(BaseModel):
    id: UUID
