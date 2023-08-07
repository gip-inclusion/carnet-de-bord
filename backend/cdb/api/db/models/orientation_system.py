from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class OrientationSystem(BaseModel):
    id: UUID
    name: str
    orientation_type: str
    created_at: datetime
    updated_at: datetime
