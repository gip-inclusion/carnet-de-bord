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
    right_are: bool
    right_ass: bool
    right_bonus: bool
    right_rsa: str | None


class RomeCodeOut(BaseModel):
    code: str
    description: str
    # This is just a string representation of description and code
    # Format is 'description (code)'
    label: str


class ProfessionalProjectOut(BaseModel):
    rome_code: RomeCodeOut


class AccountInfoOut(BaseModel):
    firstname: str
    lastname: str
    email: str | None


class ActionOut(BaseModel):
    action: str
    status: str
    created_at: datetime
    updated_at: datetime
    creator_account_info: AccountInfoOut


class TargetOut(BaseModel):
    target: str
    created_at: datetime
    updated_at: datetime
    status: str
    actions: list[ActionOut] | None = None


class FocusOut(BaseModel):
    theme: str
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


class AppointmentOut(BaseModel):
    account_info: AccountInfoOut | None
    date: date
    status: str
    created_at: datetime | None
    updated_at: datetime | None


class NotebookOut(BaseModel):
    beneficiary: BeneficiaryOut
    created_at: datetime
    updated_at: datetime
    right_rsa: str | None = Field(None, title="Droits RSA")
    right_rqth: bool = Field(False, title="Droits RQTH")
    right_are: bool = Field(False, title="Droits RSA")
    right_ass: bool | None = Field(False, title="Droits ASS")
    right_bonus: bool = Field(False, title="Droits Bonus")
    professional_projects: list[ProfessionalProjectOut]
    focuses: list[FocusOut]
    members: list[NotebookMemberOut]
    appointments: list[AppointmentOut]
    geographical_area: int | None
    education_level: str | None
    work_situation_date: date | None
    contract_type: str | None
    contract_sign_date: date | None
    work_situation: str | None
    work_situation_end_date: date | None
    contract_start_date: date | None
    contract_end_date: date | None
