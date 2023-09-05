from uuid import UUID

from pydantic import BaseModel, Field

from cdb.api.v1.payloads.hasura_action import HasuraActionPayload


class CreateNotebookFocusInput(BaseModel):
    notebook_id: UUID = Field(alias="notebookId")
    theme: str | None


class CreateNotebookFocusActionPayload(HasuraActionPayload):
    input: CreateNotebookFocusInput


class CreatedNotebookFocus(BaseModel):
    id: UUID


class DeleteNotebookFocusInput(BaseModel):
    id: UUID


class DeleteNotebookFocusActionPayload(HasuraActionPayload):
    input: DeleteNotebookFocusInput


class DeletedNotebookFocus(BaseModel):
    id: UUID
