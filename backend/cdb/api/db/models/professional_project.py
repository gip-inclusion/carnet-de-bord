from uuid import UUID

from pydantic import BaseModel

from cdb.api.db.models.rome_code import RomeCode


class ProfessionalProject(BaseModel):
    id: UUID
    notebook_id: UUID
    rome_code_id: UUID
    rome_code: RomeCode
