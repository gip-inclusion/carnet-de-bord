from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from api.db.models.target import Target


class Focus(BaseModel):
    id: UUID
    theme: str
    situtations: dict
    creator_id: UUID
    notebook_id: UUID
    created_at: datetime
    updated_at: datetime
    linked_to: str | None
    targets: list[Target] | None
