from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field
from strenum import StrEnum


class OrientationType(StrEnum):
    pro = "pro"
    social = "social"
    sociopro = "sociopro"


class OrientationRequest(BaseModel):
    id: UUID
    created_at: datetime
    updated_at: datetime
    decided_at: datetime | None
    beneficiary_id: UUID
    requestor_account_id: UUID
    requested_orientation_type_id: OrientationType | None
    decided_orientation_type_id: OrientationType | None
    status: str
    reason: str | None
