from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class AdminStructureInput(BaseModel):
    email: EmailStr
    lastname: str | None
    firstname: str | None
    phone_numbers: str | None
    position: str | None
    deployment_id: UUID


class AdminStructure(AdminStructureInput):
    id: UUID
    created_at: datetime
    updated_at: datetime


class AdminStructureStructureInput(BaseModel):
    admin: AdminStructureInput
    structure_id: UUID


class Beneficiary(BaseModel):
    firstname: str
    lastname: str


class Structure(BaseModel):
    name: str
    beneficiaries: list[Beneficiary]


class NotifiedAdminStructure(BaseModel):
    email: EmailStr
    structures: list[Structure]
