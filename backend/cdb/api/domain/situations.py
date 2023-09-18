import logging
from dataclasses import dataclass
from datetime import datetime
from typing import List, Tuple

from cdb.api.db.models.ref_situation import NotebookSituation, RefSituation
from cdb.pe.models.dossier_individu_api import Contrainte

logger = logging.getLogger(__name__)


@dataclass
class SituationToAdd:
    situation: RefSituation
    created_at: datetime | None = None


@dataclass
class SituationToDelete:
    situation: RefSituation


@dataclass
class SituationDifferences:
    situations_to_add: List[SituationToAdd]
    situations_to_delete: List[SituationToDelete]

    def to_human_readable(self):
        situations_to_add_str = (
            "\n[Situations to add " + str(len(self.situations_to_add)) + "]\n"
        )

        for situation in self.situations_to_add:
            situations_to_add_str += (
                "\t"
                + situation.situation.description
                + " ("
                + str(situation.situation.id)
                + ")\n"
            )

        situations_to_delete_str = (
            "\n[Notebook situations to delete "
            + str(len(self.situations_to_delete))
            + "]\n"
        )

        for situation in self.situations_to_delete:
            situations_to_delete_str += str(situation.situation.id) + "\n"

        return situations_to_add_str + situations_to_delete_str


def diff_situations(
    contraintes: List[Contrainte],
    ref_situations: List[RefSituation],
    notebook_situations: List[NotebookSituation],
) -> SituationDifferences:
    pe_situations: List[Tuple[RefSituation | None, datetime | None]] = [
        (find_ref_situation(ref_situations, situation.libelle), contrainte.date)
        for contrainte in contraintes
        if contrainte.valeur == "OUI"
        for situation in contrainte.situations
        if situation.valeur == "OUI"
    ]

    valid_pe_situations = [
        (ref_situation, date)
        for (ref_situation, date) in pe_situations
        if ref_situation is not None and ref_situation.id is not None
    ]

    return SituationDifferences(
        situations_to_add=[
            SituationToAdd(situation=ref_situation, created_at=date)
            for (ref_situation, date) in valid_pe_situations
            if ref_situation.id
            not in [situation.situationId for situation in notebook_situations]
        ],
        situations_to_delete=[
            SituationToDelete(situation=situation)
            for situation in notebook_situations
            if situation.situationId
            not in [ref_situation.id for (ref_situation, _) in valid_pe_situations]
        ],
    )


def find_ref_situation(
    ref_situations: List[RefSituation],
    description: str,
) -> None | RefSituation:
    matching_ref_situations = [
        ref_situation
        for ref_situation in ref_situations
        if ref_situation.description == description
    ]
    ref_situation = (
        matching_ref_situations[0] if len(matching_ref_situations) == 1 else None
    )
    if ref_situation is None:
        logger.warning(f"No ref_situation with description='{description}' found.")

    return ref_situation
