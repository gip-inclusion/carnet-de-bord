import logging
from datetime import date
from tempfile import SpooledTemporaryFile
from typing import Generator, List

import lxml.etree as etree
from pydantic import BaseModel, Field, validator


class CafInfoFlux(BaseModel):
    date: date
    type: str


class CafBeneficiary(BaseModel):
    nir: str
    soumis_droit_et_devoir: bool

    @validator("soumis_droit_et_devoir", pre=True)
    def validate_soumis_droit_devoir(value):
        if type(value) == str:
            return transform_bool(value)
        elif type(value) == bool:
            return value
        return None


class CafMsaInfosFoyer(BaseModel):
    matricule: str
    etat_droit_rsa: str
    personnes: List[CafBeneficiary]
    motif_suspension_versement_rsa: str | None
    motif_cloture_rsa: str | None
    date_cloture_rsa: str | None
    sans_domicile_fixe: str


class CdbBeneficiaryInfos(BaseModel):
    cafNumber: str = Field(alias="caf_number")
    rightRsa: str = Field(alias="right_rsa")
    subjectToRightAndDuty: bool = Field(alias="subject_right_and_duty")
    rsaSuspensionReason: str | None = Field(alias="rsa_suspension_reason")
    rsaClosureReason: str | None = Field(alias="rsa_closure_reason")
    rsaClosureDate: str | None = Field(alias="rsa_closure_date")
    isHomeless: bool = Field(alias="is_homeless")


def parse_infos_flux(node: etree._ElementTree) -> CafInfoFlux:
    date_str = node.findtext("DTCREAFLUX", default=None, namespaces=None)
    type_flux = node.findtext("TYPEFLUX", default=None, namespaces=None)
    return CafInfoFlux(date=date.fromisoformat(date_str), type=type_flux)


def parse_infos_foyer_rsa(node: etree._ElementTree) -> CafMsaInfosFoyer:
    personneNodes: list[etree._ElementTree] = node.findall("Personne", namespaces=None)

    personnes = [
        CafBeneficiary(
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
        motif_suspension_versement_rsa=node.findtext(
            "PrestationRSA/SituationDossierRSA/SuspensionVersement/MOTISUSVERSRSA",
            default=None,
            namespaces=None,
        ),
        motif_cloture_rsa=node.findtext(
            "PrestationRSA/SituationDossierRSA/FinDroit/MOTICLORSA",
            default=None,
            namespaces=None,
        )
        or node.findtext(
            "PrestationRSA/SituationDossierRSA/FinDroitMoisAnterieur/MOTICLORSA",
            default=None,
            namespaces=None,
        ),
        date_cloture_rsa=node.findtext(
            "PrestationRSA/SituationDossierRSA/FinDroit/DTCLORSA",
            default=None,
            namespaces=None,
        )
        or node.findtext(
            "PrestationRSA/SituationDossierRSA/FinDroitMoisAnterieur/DTCLORSA",
            default=None,
            namespaces=None,
        ),
        sans_domicile_fixe=node.findtext(
            "PrestationRSA/DetailDroitRSA/TroncCommunDroitRSA/TOPSANSDOMFIXE",
            default=None,
            namespaces=None,
        ),
    )


def parse_caf_file(
    file: SpooledTemporaryFile,
) -> Generator[CafInfoFlux | CafMsaInfosFoyer, None, None]:
    logging.info("demarage du parsing xml")
    items = etree.iterparse(file, tag=("IdentificationFlux", "InfosFoyerRSA"))
    for _, node in items:
        if node.tag == "IdentificationFlux":
            logging.info("Noeud IdentificationFlux trouvé")
            yield parse_infos_flux(node)
        else:
            yield parse_infos_foyer_rsa(node)


def transform_right_rsa(value: str) -> str:
    return {
        "0": "rsa_demande_en_attente",
        "1": "rsa_refuse",
        "2": "rsa_droit_ouvert_versable",
        "3": "rsa_droit_ouvert_et_suspendu",
        "4": "rsa_droit_ouvert_versement_suspendu",
        "5": "rsa_clos",
        "6": "rsa_clos_anterieur",
    }[value.strip()]


def transform_suspension_reason(value: str | None) -> str | None:
    return {
        "01": "caf_ressources_trop_elevees",
        "02": "caf_moins_25_sans_personne_charge",
        "03": "caf_activite_non_conforme",
        "04": "caf_titre_sejour_invalid",
        "05": "caf_rsa_inferieur_seuil",
        "06": "caf_declaration_ressource_non_fournie",
        "09": "caf_residence_non_conforme",
        "19": "caf_pas_isolement",
        "31": "caf_prestation_exclue",
        "34": "caf_regime_non_conforme",
        "35": "caf_demande_avantage_vieillesse_absent",
        "36": "caf_titre_sejour_absent",
        "44": "caf_hospitalisation",
        "70": "caf_action_non_engagee",
        "78": "caf_surface_ponderee_sup",
        "84": "caf_droit_eteint",
        "85": "caf_pas_allocataire",
        "97": "caf_beneficiaire_aah",
        "AB": "caf_allocataire_absent",
        "CV": "caf_attente_decision_PCG",
        "CZ": "caf_activite_anterieur_insuffisante",
        "DA": "caf_activite_anterieure_absente",
        "DB": "caf_etudiant_remuneration_insuffisante",
        "DC": "caf_activite_anterieure_non_conforme",
    }.get(value.strip() if value else "")


def transform_closure_reason(value: str | None) -> str | None:
    return {
        "PCG": "caf_decision_pcg",
        "ECH": "caf_echeance",
        "EFF": "caf_annulation_bascule_rmi",
        "MUT": "caf_mutation",
        "RGD": "caf_regroupement",
        "RFD": "caf_radie_fin_droit",
        "RAU": "caf_radie_autre_motif",
        "RST": "caf_radie_option_rsta",
        "RSO": "caf_radie_option_rso",
    }.get(value.strip() if value else "")


def transform_bool(value: str) -> bool:
    return {"0": False, "1": True}[value.strip()]


def transform_cafMsaFoyer_to_beneficiary(
    personne: CafBeneficiary,
    cafMsaFoyer: CafMsaInfosFoyer,
) -> CdbBeneficiaryInfos:
    return CdbBeneficiaryInfos(
        subject_right_and_duty=personne.soumis_droit_et_devoir,
        right_rsa=transform_right_rsa(cafMsaFoyer.etat_droit_rsa),
        rsa_closure_reason=transform_closure_reason(cafMsaFoyer.motif_cloture_rsa),
        rsa_closure_date=cafMsaFoyer.date_cloture_rsa,
        rsa_suspension_reason=transform_suspension_reason(
            cafMsaFoyer.motif_suspension_versement_rsa
        ),
        caf_number=cafMsaFoyer.matricule,
        is_homeless=transform_bool(cafMsaFoyer.sans_domicile_fixe),
    )


"""
ETATDOSRSA
0=Nouvelle demande en attente de décision CG pour ouverture du droit
1=Droit refusé
2=Droit ouvert et versable
3=Droit ouvert et suspendu
    (le montant du droit est calculable, mais l'existence du droit est remis en cause)
4=Droit ouvert mais versement suspendu (le montant du droit n'est pas calculable)
5=Droit clos
6=Droit clos sur mois antérieur ayant eu un contrôle dans le mois de référence
    pour une période antérieure.

La détection des codes doit se faire selon la séquence suivante :
    code 0, code 1, code 5, code 3, code 4,  code 2, code 6.

MOTISUSVERSRSA
"01" : Ressources trop élévées
"02" : Moins 25 ans sans enft/autre person. à charge
"03" : Activité non conforme
"04" : Titre de séjour non valide
"05" : RSA inférieur au seuil
"06" : Déclaration Trimestrielle Ressources non fournie
"09" : Résidence non conforme
"19" : Pas d'isolement
"31" : Prestation exclue affil partielle
"34" : Régime non conforme
"35 " : Demande avantage vielliesse absent ou tardif
"36" : Titre de séjour absent
"44" : Hospitalisation
"70" : Action non engagée
"78" : Surface pondérée > plafond ou inconnue
"84" : Droit éteint ou autre cas  !L8207!
"85" : Pas d'allocataire
"97" : Bénéficiaire AAH réduite
"AB " : Allocataire absent du foyer
"CV "  : Attente décision PCG (le droit reste théorique jusqu'au retour)
"CZ" : Activité antérieure insuffisante
"DA" : Activité antérieure absente
"DB" : Etudiant rémunération insuff.
"DC" : Activité antérieure non conforme

MOTICLORSA
PCG= cloture suite décision du Président du Conseil général
ECH=Cloture suite à échéance (4 mois sans droits)
EFF = Cloture suite à l'annulation de la bascule RMI/API
MUT = Cloture suite à mutation du dossier dans un autre organisme
RGD= cloture pour regroupement de dossier
RFD=radié fin de droit
RAU=radié autre motif
RST=radié option RSTA Dom
RSO=radié option RSO Dom

TOPSANSDOMFIXE
'1' si sans domicile fixe,
'0' si  domicile fixe

TOPPERSDRODEVORSA
'1' si la personne traitée est soumise à droits et devoirs :
- la moyenne mensuelle des revenus d'activités perçus au cours du
trimestre de référence de la personne traitée (pris en compte pour le
calcul RSA) est inférieure au seuil fixé par décret (500euros)
et
- la personne est à charge au sens RSa
et
- il existe un droit réel au RSA socle non nul ou
nul parce que inférieur au seuil de versement

'0' si la personne traitée n'est pas soumise à droits et devoirs :
- la moyenne mensuelle des revenus d'activité perçus au cours du
trimestre de référence de la personne traitée (pris en compte pour le
calcul RSA) est supérieure ou égale au seuil fixé par décret (500euros)
ou
- la personne n'est pas à charge au sesn RSA
ou
- il existe un droit réel au RSA nul et non inférieur
    au seuil de versement

"""
