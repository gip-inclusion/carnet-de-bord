from datetime import datetime, timedelta, timezone
from typing import Any, List
from uuid import UUID

from dateutil.parser import isoparse
from pydantic import BaseModel

from cdb.api.db.models.ref_situation import NotebookSituation


class Target(BaseModel):
    id: UUID
    target: str


class Focus(BaseModel):
    id: UUID
    theme: str
    created_at: str
    targets: List[Target]


class Notebook(BaseModel):
    diagnostic_fetched_at: str | None
    beneficiary_id: UUID
    nir: str | None
    date_of_birth: str
    last_diagnostic_hash: str | None
    situations: List[NotebookSituation]
    focuses: List[Focus]
    deployment_config: dict[str, Any]

    def has_fresh_pe_data(self) -> bool:
        if not self.diagnostic_fetched_at:
            return False
        creation_date = isoparse(self.diagnostic_fetched_at)
        expiry_date = creation_date + timedelta(hours=1)
        now = datetime.now(tz=timezone.utc)
        return now <= expiry_date

    def has_pe_diagnostic(self) -> bool:
        return self.last_diagnostic_hash is not None
