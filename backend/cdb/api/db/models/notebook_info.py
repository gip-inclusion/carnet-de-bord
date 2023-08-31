from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class NotebookInfo(BaseModel):
    notebook_id: UUID
    orientation_system_id: UUID | None
    orientation_reason: str | None
    created_at: datetime
    updated_at: datetime
