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


def parse_infos_foyer_rsa(node: etree._ElementTree):

    personneNodes: list[etree._ElementTree] = node.findall("Personne", namespaces=None)

    personnes = [
        Personne(
            nir=personne.findtext("Identification/NIR", default=None, namespaces=None),
            soumis_droit_et_devoir=personne.findtext(
                "MontantCalculDroitRSAPersonne/TOPPERSDRODEVORSA",
                default=None,
                namespaces=None,
            ),
        )
        for personne in personneNodes
    ]

    return CafMsaInfosFoyer(
        matricule=node.findtext(
            "IdentificationRSA/Organisme/MATRICULE", default=None, namespaces=None
        ),
        personnes=personnes,
        etat_droit_rsa=node.findtext(
            "PrestationRSA/SituationDossierRSA/EtatDossierRSA/ETATDOSRSA",
            default=None,
            namespaces=None,
        ),
        motif_versement_rsa=node.findtext(
            "PrestationRSA/SituationDossierRSA/SuspensionVersement/MOTISUSVERSRSA",
            default=None,
            namespaces=None,
        ),
        motif_cloture_rsa=node.findtext(
            "PrestationRSA/SituationDossierRSA/FinDroit/MOTICLORSA",
            default=None,
            namespaces=None,
        ),
        date_cloture_rsa=node.findtext(
            "PrestationRSA/SituationDossierRSA/FinDroit/DTCLORSA",
            default=None,
            namespaces=None,
        ),
        sans_domicile_fixe=node.findtext(
            "PrestationRSA/DetailDroitRSA/TroncCommunDroitRSA/TOPSANSDOMFIXE",
            default=None,
            namespaces=None,
        ),
    )
