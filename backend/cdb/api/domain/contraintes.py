from typing import List
from uuid import UUID

from attr import dataclass

from cdb.api.db.models.focus import Focus
from cdb.pe.models.dossier_individu_api import Contrainte


@dataclass
class FocusToAdd:
    theme: str


@dataclass
class FocusDifferences:
    focus_to_add: List[FocusToAdd]
    focus_to_delete: List[UUID]


def getThemeFromContrainteId(id: str) -> str | None:
    if id == "23":
        return "mobilite"
    if id == "24":
        return "contraintes_familiales"
    if id == "25":
        return "sante"
    if id == "26":
        return "maitrise_langue"
    if id == "27":
        return "logement"
    if id == "28":
        return "difficulte_financiere"
    if id == "29":
        return "difficulte_administrative"


def getContrainteIdFromTheme(theme: str) -> str | None:
    if theme == "mobilite":
        return "23"
    if theme == "contraintes_familiales":
        return "24"
    if theme == "sante":
        return "25"
    if theme == "maitrise_langue":
        return "26"
    if theme == "logement":
        return "27"
    if theme == "difficulte_financiere":
        return "28"
    if theme == "difficulte_administrative":
        return "29"


def contraintes_to_focus(contrainte: Contrainte) -> FocusToAdd:
    theme = getThemeFromContrainteId(contrainte.code)
    if not theme:
        raise Exception("unkonwn contrainte code")
    return FocusToAdd(theme=theme)


def diff_contraintes(
    focuses: List[Focus], contraintes: List[Contrainte]
) -> FocusDifferences:
    return FocusDifferences(
        focus_to_add=[
            FocusToAdd(getThemeFromContrainteId(contrainte.code))
            for contrainte in contraintes
            if contrainte.code
            not in [getContrainteIdFromTheme(focus.theme) for focus in focuses]
            and contrainte.valeur == "OUI"
            and getThemeFromContrainteId(contrainte.code)
        ],
        focus_to_delete=[
            focus.id
            for focus in focuses
            if getContrainteIdFromTheme(focus.theme)
            not in [
                contrainte.code
                for contrainte in contraintes
                if contrainte.valeur == "OUI"
            ]
        ],
    )
