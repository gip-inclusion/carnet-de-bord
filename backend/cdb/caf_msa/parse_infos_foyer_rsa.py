from typing import List

import lxml.etree as etree
from pydantic import BaseModel


class Personne(BaseModel):
    nir: str
    soumis_droit_et_devoir: str


class CafMsaInfosFoyer(BaseModel):
    matricule: str
    etat_droit_rsa: str
    personnes: List[Personne]
    motif_versement_rsa: str | None
    motif_cloture_rsa: str | None
    date_cloture_rsa: str | None
    sans_domicile_fixe: bool


def parseInfosFoyerRSA(node: etree._ElementTree):
    matricule = node.find("/IdentificationRSA/Organisme/MATRICULE", None)
    personneNodes = node.findall("/Personne", None)
    personnes = [
        Personne(
            nir=personne.find("/Identifcation/NIR:text()", None),
            soumis_droit_et_devoir=personne.find(
                "/Identifcation/TOPPERSDRODEVORSA:text()", None
            ),
        )
        for personne in personneNodes
    ]

    etat_droit_rsa = node.find(
        "/PrestationRSA/SituationDossierRSA/EtatDossierRSA/ETATDOSRSA", None
    )
    motif_versement_rsa = node.find(
        "/PrestationRSA/SituationDossierRSA/SuspensionVersement/MOTISUSVERSRSA", None
    )
    motif_cloture_rsa = node.find(
        "/PrestationRSA/SituationDossierRSA/FinDroit/MOTICLORSA", None
    )
    date_cloture_rsa = node.find(
        "/PrestationRSA/SituationDossierRSA/FinDroit/DTCLORSA", None
    )
    sans_domicile_fixe = node.find(
        "/PrestationRSA/DetailDroitRSA/TroncCommunDroitRSA/TOPSANSDOMFIXE", None
    )

    return CafMsaInfosFoyer(
        matricule=matricule,
        personnes=personnes,
        etat_droit_rsa=etat_droit_rsa,
        motif_versement_rsa=motif_versement_rsa,
        motif_cloture_rsa=motif_cloture_rsa,
        date_cloture_rsa=date_cloture_rsa,
        sans_domicile_fixe=sans_domicile_fixe,
    )
