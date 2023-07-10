import hashlib
import json
from datetime import datetime

from pydantic import BaseModel


class Situation(BaseModel):
    code: str
    libelle: str
    valeur: str


class Objectif(BaseModel):
    code: str
    libelle: str
    valeur: str


class Besoin(BaseModel):
    code: str
    libelle: str
    valeur: str


class Metier(BaseModel):
    idMetierChiffre: str
    nomMetier: str | None
    typologie: str | None
    statut: str
    estPrioritaire: bool
    dateMiseAJour: str | None
    besoins: list[Besoin]


class Contrainte(BaseModel):
    code: str
    libelle: str
    valeur: str
    date: datetime | None
    situations: list[Situation]
    objectifs: list[Objectif]


class ContraintesIndividu(BaseModel):
    conseiller: str | None
    dateDeModification: str | None
    code: str
    libelle: str | None
    contraintes: list[Contrainte]


class DossierIndividuData(BaseModel):
    besoinsParDiagnosticIndividuDtos: list[Metier]
    contraintesIndividusDto: ContraintesIndividu

    def jsonb(self):
        return json.loads(self.json())

    def hash(self):
        s = str(self.jsonb())
        return hashlib.sha256(s.encode()).hexdigest()
