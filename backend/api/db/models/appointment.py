from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel


class Appointment(BaseModel):
    id: UUID
    notebook_id: UUID
    account_id: UUID
    date: date
    status: str
    created_at: datetime | None
    updated_at: datetime | None
