from datetime import datetime
from uuid import UUID

from pydantic import BaseModel
from strenum import StrEnum


class NotebookMemberInsert(BaseModel):
    notebook_id: UUID
    account_id: UUID
    last_visited_at: datetime | None = None
    member_type: str
    last_modified_at: datetime | None = None
    creator_id: UUID | None = None
    invitation_sent_at: datetime | None = None
    active: bool = True


class NotebookMember(NotebookMemberInsert):
    id: UUID
    created_at: datetime


class NotebookMemberTypeEnum(StrEnum):
    NO_REFERENT = "no_referent"
    REFERENT = "referent"
