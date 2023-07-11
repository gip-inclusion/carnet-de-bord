from datetime import datetime
from typing import List
from uuid import UUID

from attr import dataclass

from cdb.api.db.models.focus import Focus
from cdb.pe.models.dossier_individu_api import Contrainte


@dataclass
class FocusToAdd:
    theme: str
    created_at: datetime | None = None


@dataclass
class FocusDifferences:
    focus_to_add: List[FocusToAdd]
    focus_to_delete: List[UUID]


def getThemeFromContrainteId(id: int) -> str | None:
    if id == 23:
        return "mobilite"
    if id == 24:
        return "contraintes_familiales"
    if id == 25:
        return "sante"
    if id == 26:
        return "maitrise_langue"
    if id == 27:
        return "logement"
    if id == 28:
        return "difficulte_financiere"
    if id == 29:
        return "difficulte_administrative"


def diff_contraintes(
    focuses: List[Focus], contraintes: List[Contrainte]
) -> FocusDifferences:
    return FocusDifferences(focus_to_add=[], focus_to_delete=[])
