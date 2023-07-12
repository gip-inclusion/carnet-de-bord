from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class RefSituation(BaseModel):
    id: UUID
    description: str
    theme: str


class NotebookSituation(BaseModel):
    id: UUID
    situationId: UUID
    createdAt: datetime
    deleteAt: datetime | None
