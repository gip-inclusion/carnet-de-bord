from datetime import datetime
from typing import List

from pydantic import BaseModel
from strenum import StrEnum


class Situation(BaseModel):
    code: str
    libelle: str
    valeur: str


class Contrainte(BaseModel):
    id: int
    nom: str
    valeur: str
    # WARNING la date est parfois null, ca ne correspond pas à la doc
    date: datetime | None
    situations: List[Situation]


class ContrainteValeurEnum(StrEnum):
    NON_ABORDEE = "NON_ABORDEE"
    OUI = "OUI"
    CLOTUREE = "CLOTUREE"


class SituationValeurEnum(StrEnum):
    NON_ABORDEE = "NON_ABORDEE"
    OUI = "OUI"
    NON = "NON"


class ObjectifValeurEnum(StrEnum):
    NON_ABORDEE = "NON_ABORDEE"
    EN_COURS = "EN_COURS"
    REALISE = "REALISE"
    ABANDONNE = "ABANDONNE"


class SituationInput(BaseModel):
    code: str
    valeur: SituationValeurEnum


class ContrainteInput(BaseModel):
    code: str
    valeur: ContrainteValeurEnum


class ObjectifInput(BaseModel):
    code: str
    valeur: ObjectifValeurEnum
