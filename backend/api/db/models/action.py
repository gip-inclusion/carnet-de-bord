from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class Action(BaseModel):
    id: UUID
    action: str
    target_id: UUID
    status: str
    creator_id: UUID
    created_at: datetime
    updated_at: datetime
    initial_id: str | None
