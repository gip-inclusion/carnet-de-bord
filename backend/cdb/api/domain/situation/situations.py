import logging
from dataclasses import dataclass
from datetime import datetime
from typing import List, Tuple
from uuid import UUID

from cdb.api.db.models.ref_situation import NotebookSituation, RefSituation
from cdb.pe.models.contrainte import Contrainte

logger = logging.getLogger(__name__)


@dataclass
class SituationToAdd:
    situation_id: UUID
    created_at: datetime | None = None


@dataclass
class SituationDifferences:
    situations_to_add: List[SituationToAdd]
    situations_to_delete: List[UUID]


def merge_contraintes_to_situations(
    contraintes: List[Contrainte],
    ref_situations: List[RefSituation],
    notebook_situations: List[NotebookSituation],
) -> SituationDifferences:
    pe_situations: List[Tuple[UUID | None, datetime | None]] = [
        (find_ref_situation(ref_situations, situation.libelle), contrainte.date)
        for contrainte in contraintes
        if contrainte.valeur == "OUI"
        for situation in contrainte.situations
        if situation.valeur == "OUI"
    ]

    valid_pe_situations = [
        (ref_situation_id, date)
        for (ref_situation_id, date) in pe_situations
        if ref_situation_id is not None
    ]

    return SituationDifferences(
        situations_to_add=[
            SituationToAdd(situation_id=ref_situation_id, created_at=date)
            for (ref_situation_id, date) in valid_pe_situations
            if ref_situation_id
            not in [situation.situationId for situation in notebook_situations]
        ],
        situations_to_delete=[
            situation.id
            for situation in notebook_situations
            if situation.situationId
            not in [ref_situation_id for (ref_situation_id, _) in valid_pe_situations]
        ],
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
    ref_situation = (
        matching_ref_situations[0].id if len(matching_ref_situations) == 1 else None
    )
    if ref_situation is None:
        logger.warning(f"No ref_situation with description='{description}' found.")

    return ref_situation
