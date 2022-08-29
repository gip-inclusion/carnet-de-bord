from datetime import date, datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel, Field
from strenum import StrEnum

from api.db.models.wanted_job import WantedJob


class Notebook(BaseModel):
    id: UUID
    created_at: datetime
    updated_at: datetime
    # @TODO: add tests for the right_* values
    right_rsa: str | None = Field(None, title="Droits RSA")
    right_rqth: bool = Field(False, title="Droits RQTH")
    right_are: bool = Field(False, title="Droits RSA")
    right_ass: bool | None = Field(False, title="Droits ASS")
    right_bonus: bool = Field(False, title="Droits Bonus")
    beneficiary_id: UUID
    wanted_jobs: List[WantedJob]
    # @TODO: add other fields
    geographical_area: str | None
    education_level: str | None
    work_situation_date: date | None
    contract_type: str | None
    contract_sign_date: date | None
    work_situation: str | None
    work_situation_end_date: date | None
    contract_start_date: date | None
    contract_end_date: date | None


class NotebookMemberInsert(BaseModel):
    notebook_id: UUID
    account_id: UUID
    last_visited_at: datetime | None = None
    member_type: str
    last_modified_at: datetime | None = None
    creator_id: datetime | None = None
    invitation_sent_at: datetime | None = None
    active: bool | None = None


class NotebookMember(NotebookMemberInsert):
    id: UUID
    created_at: datetime


class NotebookMemberTypeEnum(StrEnum):
    NO_REFERENT = "no_referent"
    REFERENT = "referent"
