from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class ManagerInput(BaseModel):
    email: EmailStr
    lastname: str | None
    firstname: str | None
    deployment_id: UUID


class Manager(ManagerInput):
    id: UUID
    created_at: datetime
    updated_at: datetime
