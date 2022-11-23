from datetime import datetime
from uuid import UUID

from pydantic import BaseModel
from strenum import StrEnum


class EventType(StrEnum):
    action = "Action d'un objectif"
    target = "Objectif d'un parcours"


class NotebookEventInsert(BaseModel):
    notebook_id: UUID
    event_date: datetime
    creator_id: UUID | None
    event: dict
    event_type: EventType | None


class NotebookEvent(NotebookEventInsert):
    id: UUID
    creation_date: datetime
