from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel

from api.db.models.account import AccountInfo


class Appointment(BaseModel):
    id: UUID
    notebook_id: UUID
    account_info: AccountInfo
    date: date
    status: str
    created_at: datetime | None
    updated_at: datetime | None
