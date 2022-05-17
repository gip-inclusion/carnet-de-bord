from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel

from api.db.models.notebook import Notebook


class Beneficiary(BaseModel):
    id: UUID
    email: str | None
    lastname: str
    firstname: str
    caf_number: str | None
    pe_number: str | None
    postal_code: str | None
    city: str | None
    address1: str | None
    address2: str | None
    mobile_number: str | None
    date_of_birth: date
    place_of_birth: str | None
    deployment_id: UUID | None
    created_at: datetime
    updated_at: datetime
    internal_id: str | None
    notebook: Notebook | None
    # People that can't login don't have an account (BRSA users)
    account_id: UUID | None
