from pydantic import BaseModel, Field

from cdb.api.v1.payloads.hasura_action import HasuraActionPayload


class NotebookInput(BaseModel):
    nir: str
    external_id: str | None = Field(alias="externalId")
    firstname: str
    lastname: str
    date_of_birth: str = Field(alias="dateOfBirth")
    mobile_number: str | None = Field(alias="mobileNumber")
    email: str | None
    address1: str | None
    address2: str | None
    postal_code: str | None = Field(alias="postalCode")
    city: str | None
    caf_number: str | None = Field(alias="cafNumber")


class CreateNotebookInput(BaseModel):
    notebook: NotebookInput


class CreateNotebookActionPayload(HasuraActionPayload):
    input: CreateNotebookInput
