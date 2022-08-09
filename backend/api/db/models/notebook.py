from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel
from strenum import StrEnum

from api.db.models.wanted_job import WantedJob


class Notebook(BaseModel):
    id: UUID
    beneficiary_id: UUID
    wanted_jobs: List[WantedJob]
    # @TODO: add other fields


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
