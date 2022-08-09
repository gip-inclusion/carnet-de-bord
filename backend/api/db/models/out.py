from datetime import date, datetime

from pydantic import BaseModel, Field


class DeploymentOut(BaseModel):
    label: str


class BeneficiaryOut(BaseModel):
    email: str | None
    lastname: str
    firstname: str
    caf_number: str | None
    pe_number: str | None
    postal_code: str | None
    city: str | None
    address1: str | None
    address2: str | None
    mobile_number: str | None
    date_of_birth: date
    place_of_birth: str | None
    created_at: datetime
    updated_at: datetime


class RomeCodeOut(BaseModel):
    code: str
    description: str
    # This is just a string representation of description and code
    # Format is 'description (code)'
    label: str


class WantedJobOut(BaseModel):
    rome_code: RomeCodeOut


class NotebookOut(BaseModel):
    beneficiary: BeneficiaryOut
    created_at: datetime
    right_rsa: str | None = Field(None, title="Droits RSA")
    right_rqth: bool = Field(False, title="Droits RQTH")
    right_are: bool = Field(False, title="Droits RSA")
    right_ass: bool | None = Field(False, title="Droits ASS")
    right_bonus: bool = Field(False, title="Droits Bonus")
    wanted_jobs: list[WantedJobOut]
