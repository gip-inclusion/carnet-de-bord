from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from cdb.api.db.models.target import Target


class Focus(BaseModel):
    id: UUID
    theme: str
    creator_id: UUID
    notebook_id: UUID
    created_at: datetime
    updated_at: datetime
    targets: list[Target] | None = None
