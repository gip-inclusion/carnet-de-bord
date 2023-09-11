from uuid import UUID

from pydantic import BaseModel, Field

from cdb.api.v1.payloads.hasura_action import HasuraActionPayload


class CreateNotebookTargetInput(BaseModel):
    focus_id: UUID = Field(alias="focusId")
    target: str
    linked_to: str | None = Field(alias="linkedTo")
    user_consent: bool = Field(alias="userConsent")


class CreateNotebookTargetActionPayload(HasuraActionPayload):
    input: CreateNotebookTargetInput


class UpdateNotebookTargetActionInput(BaseModel):
    id: UUID
    status: str
    linked_to: str | None = Field(alias="linkedTo")


class CreatedNotebookTarget(BaseModel):
    id: UUID


class UpdateNotebookTargetStatusActionPayload(HasuraActionPayload):
    input: UpdateNotebookTargetActionInput


class UpdatedNotebookTarget(BaseModel):
    id: UUID
