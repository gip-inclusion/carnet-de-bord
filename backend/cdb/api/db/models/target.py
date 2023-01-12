from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from cdb.api.db.models.action import Action


class Target(BaseModel):
    id: UUID
    focus_id: UUID
    target: str
    creator_id: UUID
    created_at: datetime
    updated_at: datetime
    status: str
    actions: list[Action] | None = None
