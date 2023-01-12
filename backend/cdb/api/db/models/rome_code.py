from uuid import UUID

from pydantic import BaseModel


class RomeCode(BaseModel):
    id: UUID
    code: str
    description: str
    # This is just a string representation of description and code
    # Format is 'description (code)'
    label: str
