from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ProfessionalInsert(BaseModel):
    structure_id: UUID
    email: str | None
    lastname: str
    firstname: str
    position: str | None
    mobile_number: str | None


class Professional(ProfessionalInsert):
    id: UUID
    account_id: UUID | None
    created_at: datetime
    updated_at: datetime
