from uuid import UUID

from asyncpg import Record
from pydantic import BaseModel, EmailStr


class Deployment(BaseModel):
    id: UUID
    label: str
    department_code: str | None


class DeploymentInput(BaseModel):
    label: str
    department_code: str | None
    manager_email: EmailStr


def parse_deployment_from_beneficiary_record(record: Record) -> Deployment | None:
    if record["dep_id"] and record["dep_label"]:
        return Deployment(
            id=record["dep_id"],
            label=record["dep_label"],
            department_code=record["dep_code"],
        )
    return None
