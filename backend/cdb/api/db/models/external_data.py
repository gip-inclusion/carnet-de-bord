from datetime import datetime
from uuid import UUID

from pydantic import BaseModel
from strenum import StrEnum


class ExternalSource(StrEnum):
    PE = "pe"
    CAFMSA = "cafmsa"


class ExternalDataInsert(BaseModel):
    source: ExternalSource
    data: dict
    hash: str


class ExternalDataUpdate(ExternalDataInsert):
    id: UUID


class ExternalDataInfoInsert(BaseModel):
    beneficiary_id: UUID | None = None
    professional_id: UUID | None = None
    external_data_id: UUID


class ExternalDataInfo(ExternalDataInfoInsert):
    created_at: datetime
    updated_at: datetime


class ExternalData(BaseModel):
    id: UUID
    source: ExternalSource
    # This is the hash of the source data
    hash: str
    data: dict
    created_at: datetime
    updated_at: datetime
    info: ExternalDataInfo | None


def format_external_data(source: dict, parsed: dict) -> dict:
    return {"source": source, "parsed": parsed}
