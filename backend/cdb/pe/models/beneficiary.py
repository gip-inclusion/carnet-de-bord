from typing import Optional

from pydantic import BaseModel


class Beneficiary(BaseModel):
    identifiant: Optional[str] = None
