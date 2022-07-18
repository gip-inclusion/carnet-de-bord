from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel

from api.db.models.rome_code import RomeCode


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
    deployment: DeploymentOut
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
    wanted_jobs: list[WantedJobOut]
