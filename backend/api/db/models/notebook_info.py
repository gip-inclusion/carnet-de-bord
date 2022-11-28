from datetime import datetime
from uuid import UUID

from pydantic import BaseModel
from strenum import StrEnum

from api.db.models.orientation_type import OrientationType


class NotebookInfo(BaseModel):
    notebook_id: UUID
    orientation: OrientationType | None
    need_orientation: bool = False
    created_at: datetime
    updated_at: datetime
