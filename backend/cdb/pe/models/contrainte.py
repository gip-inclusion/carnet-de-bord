from datetime import datetime
from typing import List

from pydantic import BaseModel


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
