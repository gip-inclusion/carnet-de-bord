from datetime import datetime
from uuid import UUID

from pydantic import BaseModel
from strenum import StrEnum


class ExternalSource(StrEnum):
    PE = "pe"


class ExternalDataInsert(BaseModel):
    source: ExternalSource
    data: dict


class ExternalDataInfo(BaseModel):
    external_data_id: UUID
    beneficiary_id: UUID | None
    created_at: datetime
    updated_at: datetime


class ExternalData(BaseModel):
    id: UUID
    source: ExternalSource
    data: dict
    created_at: datetime
    updated_at: datetime
    info: ExternalDataInfo | None


class ExternalDataInfoInsert(BaseModel):
    beneficiary_id: UUID | None
    external_data_id: UUID
