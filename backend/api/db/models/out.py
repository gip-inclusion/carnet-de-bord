from datetime import date, datetime

from pydantic import BaseModel


class DeploymentOut(BaseModel):
    pass


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
    internal_id: str | None


class NotebookOut(BaseModel):
    beneficiary: BeneficiaryOut
