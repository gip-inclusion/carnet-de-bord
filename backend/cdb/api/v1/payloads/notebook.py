from pydantic import BaseModel

from cdb.api.v1.payloads.hasura_action import HasuraActionPayload


class NotebookInput(BaseModel):
    nir: str
    externalId: str | None
    firstname: str
    lastname: str
    date_of_birth: str
    mobileNumber: str | None
    email: str | None
    address: str | None
    address2: str | None
    postal_code: str | None
    city: str | None
    cafNumber: str | None


class CreateNotebookInput(BaseModel):
    notebook: NotebookInput


class CreateNotebookActionPayload(HasuraActionPayload):
    input: CreateNotebookInput
