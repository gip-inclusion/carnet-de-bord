import json
from datetime import datetime
from typing import List
from uuid import UUID

from attr import dataclass
from pydantic import BaseModel

from cdb.api.db.crud.account import POLE_EMPLOI_SERVICE_ACCOUNT_ID
from cdb.api.v1.routers.pe_diagnostic.pe_diagnostic_models import Focus
from cdb.cdb_csv.json_encoder import CustomEncoder
from cdb.pe.models.dossier_individu_api import (
    Contrainte,
    ContrainteValeurEnum,
    Objectif,
    ObjectifValeurEnum,
)


@dataclass
class TargetPayload:
    target: str
    createdAt: datetime | None = None


@dataclass
class FocusToAdd:
    theme: str
    creator_id: UUID
    created_at: datetime | None = None
    targets: List[TargetPayload] = []


class TargetToAdd(BaseModel):
    target: str
    creatorId: UUID
    focusId: UUID
    createdAt: datetime | None = None

    def jsonb(self):
        return json.loads(json.dumps(self.dict(exclude_none=True), cls=CustomEncoder))


class TargetToDelete(TargetToAdd):
    id: UUID


class TargetToCancel(TargetToDelete):
    pass


class TargetToEnd(TargetToDelete):
    pass


@dataclass
class TargetDifferences:
    targets_to_add: List[TargetToAdd]
    targets_to_delete: List[TargetToDelete]
    targets_to_cancel: List[TargetToCancel]
    targets_to_end: List[TargetToEnd]


@dataclass
class FocusDifferences:
    focuses_to_add: List[FocusToAdd]
    focuses_to_delete: List[Focus]
    target_differences: TargetDifferences

    def to_human_readable(self):
        focuses_to_add_str = "\n"
        total_targets_to_add = 0
        for focus_to_add in self.focuses_to_add:
            focuses_to_add_str += focus_to_add.theme + "\n"
            for target in focus_to_add.targets:
                focuses_to_add_str += "\t" + target.target + "\n"
                total_targets_to_add += 1

        focuses_to_delete_str = "\n"
        total_targets_to_delete = 0
        for focus_to_delete in self.focuses_to_delete:
            focuses_to_delete_str += (
                focus_to_delete.theme + " (" + str(focus_to_delete.id) + ")\n"
            )
            for target in focus_to_delete.targets:
                focuses_to_delete_str += (
                    "\t" + target.target + " (" + str(target.id) + ")\n"
                )
                total_targets_to_delete += 1
        focuses_to_add_header_str = (
            "\n[New focuses to add: "
            + str(len(self.focuses_to_add))
            + ", total targets to add: "
            + str(total_targets_to_add)
            + "]\n"
        )

        focuses_to_delete_header_str = (
            "\n[New focuses to delete: "
            + str(len(self.focuses_to_delete))
            + ", total targets to delete: "
            + str(total_targets_to_delete)
            + "]\n"
        )

        targets_to_add_str = (
            "\n[Other targets to add "
            + str(len(self.target_differences.targets_to_add))
            + " (common focus)]\n"
        )

        for target in self.target_differences.targets_to_add:
            targets_to_add_str += "\t" + target.target + "\n"

        targets_to_delete_str = (
            "\n[Other targets to delete "
            + str(len(self.target_differences.targets_to_delete))
            + " (common focus)]\n"
        )

        for target in self.target_differences.targets_to_delete:
            targets_to_delete_str += (
                "\t" + target.target + " (" + str(target.id) + ")\n"
            )

        targets_to_cancel_str = (
            "\n[Other targets to cancel "
            + str(len(self.target_differences.targets_to_cancel))
            + " (common focus)]\n"
        )

        for target in self.target_differences.targets_to_cancel:
            targets_to_cancel_str += (
                "\t" + target.target + " (" + str(target.id) + ")\n"
            )

        targets_to_end_str = (
            "\n[Other targets to end "
            + str(len(self.target_differences.targets_to_end))
            + " (common focus)]\n"
        )

        for target in self.target_differences.targets_to_end:
            targets_to_end_str += "\t" + target.target + " (" + str(target.id) + ")\n"

        return (
            focuses_to_add_header_str
            + focuses_to_add_str
            + focuses_to_delete_header_str
            + focuses_to_delete_str
            + targets_to_add_str
            + targets_to_delete_str
            + targets_to_cancel_str
            + targets_to_end_str
        )


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
        if contrainte.valeur == ContrainteValeurEnum.OUI
        and getContrainteIdFromTheme(focus.theme) == contrainte.code
    ]
    targets_to_add = []
    targets_to_delete = []
    targets_to_cancel = []
    targets_to_end = []
    for shared_focus, shared_contrainte in shared_contraintes_focuses:
        targets = shared_focus.targets or []
        objectifs = shared_contrainte.objectifs

        for objectif in objectifs:
            if (
                objectif.valeur == ObjectifValeurEnum.EN_COURS
                and objectif.libelle not in [target.target for target in targets]
            ):
                targets_to_add.append(
                    TargetToAdd(
                        target=objectif.libelle,
                        focusId=shared_focus.id,
                        createdAt=shared_contrainte.date,
                        creatorId=POLE_EMPLOI_SERVICE_ACCOUNT_ID,
                    )
                )

        for target in targets:
            if target.target in [
                objectif.libelle
                for objectif in objectifs
                if objectif.valeur == ObjectifValeurEnum.ABANDONNE
            ]:
                targets_to_cancel.append(target)

        for target in targets:
            if target.target in [
                objectif.libelle
                for objectif in objectifs
                if objectif.valeur == ObjectifValeurEnum.REALISE
            ]:
                targets_to_end.append(target)

        for target in targets:
            if target.target not in [objectif.libelle for objectif in objectifs]:
                targets_to_delete.append(target)

    return TargetDifferences(
        targets_to_add=targets_to_add,
        targets_to_cancel=targets_to_cancel,
        targets_to_end=targets_to_end,
        targets_to_delete=targets_to_delete,
    )


def contraintes_to_focus(contrainte: Contrainte) -> FocusToAdd:
    theme = getThemeFromContrainteId(contrainte.code)
    if not theme:
        raise Exception("unkonwn contrainte code")
    return FocusToAdd(theme=theme, creator_id=POLE_EMPLOI_SERVICE_ACCOUNT_ID)


# TODO : Il faut ajouter une entrée dans notebook_event quand on supprime un objectif
def diff_contraintes(
    focuses: List[Focus], contraintes: List[Contrainte]
) -> FocusDifferences:
    return FocusDifferences(
        focuses_to_add=[
            contrainte_to_focus(contrainte)
            for contrainte in contraintes
            if contrainte.code
            not in [getContrainteIdFromTheme(focus.theme) for focus in focuses]
            and contrainte.valeur == ContrainteValeurEnum.OUI
            and getThemeFromContrainteId(contrainte.code)
        ],
        focuses_to_delete=[
            focus
            for focus in focuses
            if getContrainteIdFromTheme(focus.theme)
            not in [
                contrainte.code
                for contrainte in contraintes
                if contrainte.valeur == ContrainteValeurEnum.OUI
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
        creator_id=POLE_EMPLOI_SERVICE_ACCOUNT_ID,
        targets=[
            objectif_to_target(objectif, createdAt=contrainte.date)
            for objectif in contrainte.objectifs
            if objectif.valeur == ObjectifValeurEnum.EN_COURS
        ],
    )


def objectif_to_target(objectif: Objectif, createdAt: datetime | None) -> TargetPayload:
    return TargetPayload(target=objectif.libelle, createdAt=createdAt)
