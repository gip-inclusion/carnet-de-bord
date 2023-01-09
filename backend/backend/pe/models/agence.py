from typing import List, Optional

from pydantic import BaseModel


class Contact(BaseModel):
    telephonePublic: Optional[str] = None
    email: Optional[str] = None


class AdressePrincipale(BaseModel):
    ligne3: Optional[str] = None
    ligne4: str
    ligne5: str
    ligne6: str
    gpsLon: float
    gpsLat: float
    communeImplantation: str
    bureauDistributeur: str


class ZoneCompetence(BaseModel):
    communeInsee: str


class Horaire(BaseModel):
    jour: int
    ouvertureMatin: str
    fermetureMatin: str
    horaireFerme: str
    horaireEnContinu: str
    ouvertureApresMidiRDV: Optional[str] = None
    fermetureApresMidiRDV: Optional[str] = None
    horaireFermeRDV: str
    horaireEnContinuRDV: str


class Agence(BaseModel):
    code: str
    codeSafir: str
    libelle: str
    libelleEtendu: str
    type: str
    typeAccueil: str
    codeRegionINSEE: Optional[str] = None
    dispositifADEDA: bool
    contact: Contact
    siret: Optional[str] = None
    adressePrincipale: AdressePrincipale
    zoneCompetences: Optional[List[ZoneCompetence]]
    horaires: Optional[List[Horaire]]
