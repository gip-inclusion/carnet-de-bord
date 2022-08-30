from datetime import date, datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel, Field

from api.db.models.appointment import Appointment
from api.db.models.focus import Focus
from api.db.models.notebook_member import NotebookMember
from api.db.models.wanted_job import WantedJob


class Notebook(BaseModel):
    id: UUID
    created_at: datetime
    updated_at: datetime
    right_rsa: str | None = Field(None, title="Droits RSA")
    right_rqth: bool = Field(False, title="Droits RQTH")
    right_are: bool = Field(False, title="Droits RSA")
    right_ass: bool | None = Field(False, title="Droits ASS")
    right_bonus: bool = Field(False, title="Droits Bonus")
    beneficiary_id: UUID
    wanted_jobs: List[WantedJob]
    focuses: List[Focus] | None = None
    members: List[NotebookMember] | None = None
    appointments: List[Appointment] | None = None
    geographical_area: str | None
    education_level: str | None
    work_situation_date: date | None
    contract_type: str | None
    contract_sign_date: date | None
    work_situation: str | None
    work_situation_end_date: date | None
    contract_start_date: date | None
    contract_end_date: date | None
