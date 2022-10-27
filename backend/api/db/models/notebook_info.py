from datetime import datetime
from uuid import UUID

from pydantic import BaseModel
from strenum import StrEnum


class OrientationType(StrEnum):
    pro = "pro"
    social = "social"
    sociopro = "sociopro"


class NotebookInfo(BaseModel):
    notebook_id: UUID
    orientation: OrientationType | None
    need_orientation: bool = False
    created_at: datetime
    updated_at: datetime
