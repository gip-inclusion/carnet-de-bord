from datetime import datetime
from uuid import UUID

from pydantic import BaseModel
from strenum import StrEnum


class ExternalSource(StrEnum):
    PE = "pe"


class ExternalDataInsert(BaseModel):
    source: ExternalSource
    data: dict
    account_id: UUID | None


class ExternalData(BaseModel):
    id: UUID
    source: ExternalSource
    data: dict
    account_id: UUID | None
    created_at: datetime
    updated_at: datetime
