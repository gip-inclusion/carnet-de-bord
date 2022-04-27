from uuid import UUID

from pydantic import BaseModel


class WantedJob(BaseModel):
    id: UUID
    notebook_id: UUID
    rome_code_id: UUID
