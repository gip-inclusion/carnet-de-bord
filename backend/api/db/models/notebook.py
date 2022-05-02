from typing import List
from uuid import UUID

from api.db.models.wanted_job import WantedJob
from pydantic import BaseModel


class Notebook(BaseModel):
    id: UUID
    beneficiary_id: UUID
    wanted_jobs: List[WantedJob]
    # @TODO: add other fields
