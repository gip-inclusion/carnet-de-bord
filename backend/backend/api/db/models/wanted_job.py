from uuid import UUID

from pydantic import BaseModel

from backend.api.db.models.rome_code import RomeCode


class WantedJob(BaseModel):
    id: UUID
    notebook_id: UUID
    rome_code_id: UUID
    rome_code: RomeCode
