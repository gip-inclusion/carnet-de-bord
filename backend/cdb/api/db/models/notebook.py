from datetime import date, datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel, Field

from cdb.api.db.models.appointment import Appointment
from cdb.api.db.models.focus import Focus
from cdb.api.db.models.notebook_member import NotebookMember
from cdb.api.db.models.professional_project import ProfessionalProject


class Notebook(BaseModel):
    id: UUID
    created_at: datetime
    updated_at: datetime
    right_rqth: bool = Field(False, title="Droits RQTH")
    beneficiary_id: UUID
    professional_projects: List[ProfessionalProject]
    focuses: List[Focus] | None = None
    members: List[NotebookMember] | None = None
    appointments: List[Appointment] | None = None
    education_level: str | None
    work_situation_date: date | None
    contract_type: str | None
    contract_sign_date: date | None
    work_situation: str | None
    work_situation_end_date: date | None
    contract_start_date: date | None
    contract_end_date: date | None
