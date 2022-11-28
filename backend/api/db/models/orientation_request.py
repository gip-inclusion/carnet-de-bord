from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from api.db.models.orientation_type import OrientationType


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
