from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class Target(BaseModel):
    id: UUID
    focus_id: UUID
    target: str
    creator_id: UUID
    notebook_id: UUID
    created_at: datetime
    updated_at: datetime
    status: str
