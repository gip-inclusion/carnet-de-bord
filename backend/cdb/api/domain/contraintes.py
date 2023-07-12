from datetime import datetime
from typing import List
from uuid import UUID

from attr import dataclass

from cdb.api.db.models.focus import Focus
from cdb.pe.models.dossier_individu_api import Contrainte, Objectif


@dataclass
class TargetPayload:
    target: str


@dataclass
class FocusToAdd:
    theme: str
    created_at: datetime | None = None
    targets: List[TargetPayload] = []


@dataclass
class TargetToAdd:
    target: str
    focus_id: UUID


@dataclass
class TargetDifferences:
    targets_to_add: List[TargetToAdd]
    target_ids_to_delete: List[UUID]


@dataclass
class FocusDifferences:
    focus_to_add: List[FocusToAdd]
    focus_ids_to_delete: List[UUID]
    target_differences: TargetDifferences


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


def diff_objectifs(
    focuses: List[Focus], contraintes: List[Contrainte]
) -> TargetDifferences:
    shared_contraintes_focuses = [
        (focus, contrainte)
        for focus in focuses
        for contrainte in contraintes
        if contrainte.valeur == "OUI"
        and getContrainteIdFromTheme(focus.theme) == contrainte.code
    ]
    targets_to_add = []
    target_ids_to_delete = []
    for shared_focus, shared_contrainte in shared_contraintes_focuses:
        targets = shared_focus.targets or []
        objectifs = shared_contrainte.objectifs

        for objectif in objectifs:
            if objectif.valeur == "OUI" and objectif not in [
                target.target for target in targets
            ]:
                targets_to_add.append(
                    TargetToAdd(target=objectif.libelle, focus_id=shared_focus.id)
                )

        for target in targets or []:
            if target.target not in [
                objectif.libelle for objectif in objectifs if objectif.valeur == "OUI"
            ]:
                target_ids_to_delete.append(target.id)

    return TargetDifferences(
        targets_to_add=targets_to_add, target_ids_to_delete=target_ids_to_delete
    )


def contraintes_to_focus(contrainte: Contrainte) -> FocusToAdd:
    theme = getThemeFromContrainteId(contrainte.code)
    if not theme:
        raise Exception("unkonwn contrainte code")
    return FocusToAdd(theme=theme)


# TODO : Il faut ajouter une entrée dans notebook_event quand on supprime un objectif
def diff_contraintes(
    focuses: List[Focus], contraintes: List[Contrainte]
) -> FocusDifferences:
    return FocusDifferences(
        focus_to_add=[
            contrainte_to_focus(contrainte)
            for contrainte in contraintes
            if contrainte.code
            not in [getContrainteIdFromTheme(focus.theme) for focus in focuses]
            and contrainte.valeur == "OUI"
            and getThemeFromContrainteId(contrainte.code)
        ],
        focus_ids_to_delete=[
            focus.id
            for focus in focuses
            if getContrainteIdFromTheme(focus.theme)
            not in [
                contrainte.code
                for contrainte in contraintes
                if contrainte.valeur == "OUI"
            ]
        ],
        target_differences=diff_objectifs(contraintes=contraintes, focuses=focuses),
    )


def contrainte_to_focus(contrainte: Contrainte) -> FocusToAdd:
    theme = getThemeFromContrainteId(contrainte.code)
    if not theme:
        raise Exception(
            "error: unknonw contrainte.code %s. " "can't found a matching theme",
            contrainte.code,
        )

    return FocusToAdd(
        theme=theme,
        created_at=contrainte.date,
        targets=[
            objectif_to_target(objectif)
            for objectif in contrainte.objectifs
            if objectif.valeur == "OUI"
        ],
    )


def objectif_to_target(objectif: Objectif) -> TargetPayload:
    return TargetPayload(target=objectif.libelle)
