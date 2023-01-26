from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class OrientationRequest(BaseModel):
    id: UUID
    created_at: datetime
    updated_at: datetime
    decided_at: datetime | None
    beneficiary_id: UUID
    requestor_account_id: UUID
    requested_orientation_system_id: UUID | None
    decided_orientation_system_id: UUID | None
    status: str
    reason: str | None
