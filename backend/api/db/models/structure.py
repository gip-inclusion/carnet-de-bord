from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class StructureInsert(BaseModel):
    siret: str | None
    name: str | None
    short_desc: str | None
    phone: str | None
    email: EmailStr | None
    postal_code: str | None
    city: str | None
    address1: str | None
    address2: str | None
    website: str | None
    deployment_id: UUID | None


class Structure(StructureInsert):
    id: UUID
    created_at: datetime
    updated_at: datetime
