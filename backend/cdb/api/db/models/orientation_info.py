from typing import List
from uuid import UUID

from pydantic import BaseModel


class OrientationInfo(BaseModel):
    beneficiary: dict
    former_referents: List[dict]
    new_structure: dict
    new_referent: dict | None
    notebook: dict

    @property
    def former_referent_account_id(self) -> UUID | None:
        return (
            UUID(self.former_referents[0]["account"]["id"])
            if len(self.former_referents) > 0
            else None
        )

    @property
    def former_structure_ids(self) -> List[UUID]:
        former_structures = (
            self.beneficiary["structures"] if self.beneficiary is not None else None
        )
        if former_structures is None:
            return []

        return [
            former_structure["structureId"] for former_structure in former_structures
        ]
