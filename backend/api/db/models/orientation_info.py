from typing import List
from uuid import UUID

from pydantic import BaseModel


class OrientationInfo(BaseModel):
    beneficiary: dict
    former_referents: List[dict]
    new_structure: dict
    new_referent: dict | None

    @property
    def former_referent_account_id(self) -> UUID | None:
        return (
            self.former_referents[0]["account"]["id"]
            if len(self.former_referents) > 0
            else None
        )

    @property
    def former_structure_id(self) -> dict | None:
        return (
            self.beneficiary["structures"][0] if self.beneficiary is not None else None
        )
