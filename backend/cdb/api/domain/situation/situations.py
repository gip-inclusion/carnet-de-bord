from dataclasses import dataclass
from datetime import datetime
from typing import List
from uuid import UUID

from cdb.api.db.models.ref_situation import RefSituation, Situation
from cdb.pe.models.contrainte import Contrainte


@dataclass
class SituationToAdd:
    situation_id: UUID
    created_at: datetime | None = None
    deleted_at: datetime | None = None


@dataclass
class SituationDifferences:
    situations_to_add: List
    situations_to_delete: List[UUID]


def merge_constraintes_to_situations(
    contraintes: List[Contrainte],
    ref_situations: List[RefSituation],
    notebook_situations: List[Situation],
) -> SituationDifferences:

    situations_to_add: List[SituationToAdd] = []

    for contrainte in contraintes:
        for situation in contrainte.situations:
            if situation.valeur != "OUI":
                continue

            situation_id = find_ref_situation(
                ref_situations=ref_situations,
                description=situation.libelle,
            )
            if situation_id is None:
                continue

            notebook_situation = find_situation(
                notebook_situations=notebook_situations,
                ref_situation_id=situation_id,
            )

            if notebook_situation is not None:
                continue

            situations_to_add.append(
                SituationToAdd(
                    situation_id=situation_id,
                    created_at=contrainte.date,
                )
            )

    return SituationDifferences(
        situations_to_add=situations_to_add, situations_to_delete=[]
    )


def find_ref_situation(
    ref_situations: List[RefSituation],
    description: str,
) -> None | UUID:
    matching_ref_situations = [
        ref_situation
        for ref_situation in ref_situations
        if ref_situation.description == description
    ]
    return matching_ref_situations[0].id if len(matching_ref_situations) == 1 else None


def find_situation(
    notebook_situations: List[Situation],
    ref_situation_id: UUID,
) -> Situation | None:
    existing_situation = [
        notebook_situation
        for notebook_situation in notebook_situations
        if notebook_situation.situation.id == ref_situation_id
    ]
    return existing_situation[0] if len(existing_situation) == 1 else None
