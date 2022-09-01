from datetime import datetime
from uuid import UUID
from xmlrpc.client import Boolean

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
    confirmed: Boolean = False
    onboarding_done: Boolean = False
    created_at: datetime
    updated_at: datetime


class AccountInfo(BaseModel):
    account_id: UUID
    firstname: str
    lastname: str
    email: str | None
