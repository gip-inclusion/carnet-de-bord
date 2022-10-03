from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from api.db.models.role import RoleEnum


class AccountDB(BaseModel):
    id: UUID
    username: str
    type: RoleEnum
    access_key: UUID | None
    access_key_date: datetime | None
    last_login: datetime | None
    admin_id: UUID | None
    manager_id: UUID | None
    orientation_manager_id: UUID | None
    admin_structure_id: UUID | None
    professional_id: UUID | None
    beneficiary_id: UUID | None
    confirmed: bool = False
    onboarding_done: bool = False
    created_at: datetime
    updated_at: datetime


class AccountInfo(BaseModel):
    account_id: UUID
    firstname: str
    lastname: str
    email: str | None
