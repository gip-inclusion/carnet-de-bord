from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class RefSituation(BaseModel):
    id: UUID
    description: str
    theme: str


class Situation(BaseModel):
    id: UUID
    situation: RefSituation
    created_at: datetime
    deleted_at: datetime | None
