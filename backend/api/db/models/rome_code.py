from uuid import UUID

from pydantic import BaseModel


class RomeCode(BaseModel):
    id: UUID
    code: str
    description: str
    label: str
