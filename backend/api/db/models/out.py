from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field

from api.db.models.role import RoleEnum


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


class ActionOut(BaseModel):
    action: str
    status: str
    created_at: datetime
    updated_at: datetime


class TargetOut(BaseModel):
    target: str
    created_at: datetime
    updated_at: datetime
    status: str
    actions: list[ActionOut] | None = None


class FocusOut(BaseModel):
    theme: str
    situations: list[str]
    created_at: datetime
    updated_at: datetime
    linked_to: str | None
    targets: list[TargetOut] | None = None


class NotebookMemberOut(BaseModel):
    last_visited_at: datetime | None
    member_type: str
    last_modified_at: datetime | None
    created_at: datetime
    invitation_sent_at: datetime | None
    active: bool | None


class NotebookOut(BaseModel):
    beneficiary: BeneficiaryOut
    created_at: datetime
    updated_at: datetime
    right_rsa: str | None = Field(None, title="Droits RSA")
    right_rqth: bool = Field(False, title="Droits RQTH")
    right_are: bool = Field(False, title="Droits RSA")
    right_ass: bool | None = Field(False, title="Droits ASS")
    right_bonus: bool = Field(False, title="Droits Bonus")
    wanted_jobs: list[WantedJobOut]
    focuses: list[FocusOut]
    members: list[NotebookMemberOut]
    geographical_area: str | None
    education_level: str | None
    work_situation_date: date | None
    contract_type: str | None
    contract_sign_date: date | None
    work_situation: str | None
    work_situation_end_date: date | None
    contract_start_date: date | None
    contract_end_date: date | None


class AccountOut(BaseModel):
    type: RoleEnum
    admin_id: UUID | None
    manager_id: UUID | None
    orientation_manager_id: UUID | None
    admin_structure_id: UUID | None
    professional_id: UUID | None
    beneficiary_id: UUID | None
    created_at: datetime
    updated_at: datetime


class AppointmentOut(BaseModel):
    account_id: AccountOut
    date: date
    status: str
    created_at: datetime | None
    updated_at: datetime | None
