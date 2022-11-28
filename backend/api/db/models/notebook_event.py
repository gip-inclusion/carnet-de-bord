from datetime import datetime
from uuid import UUID

from pydantic import BaseModel
from strenum import StrEnum


class EventStatus(StrEnum):
    done = "done"
    target = "in_progress"
    abandoned = "abandoned"


class EventType(StrEnum):
    action = "action"
    target = "target"


class NotebookEventInsert(BaseModel):
    notebook_id: UUID
    event_date: datetime
    creator_id: UUID | None
    event: dict
    event_type: EventType | None


class NotebookEvent(NotebookEventInsert):
    id: UUID
    creation_date: datetime
