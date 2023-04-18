import io
from datetime import date
from unittest import TestCase

import lxml.etree as etree
import pytest

from cdb.caf_msa.parse_infos_foyer_rsa import (
    CafInfoPersonne,
    CafMsaInfosFoyer,
    CdbBeneficiaryInfos,
    parse_caf_file,
    transform_bool,
    transform_cafMsaFoyer_to_beneficiary,
    transform_closure_reason,
    transform_right_rsa,
    transform_suspension_reason,
)
from cdb.caf_msa.validate_xml import validate_xml


async def test_validate_incorrect_file(flux_quotidien_caf_invalid: io.BufferedReader):
    with pytest.raises(etree.DocumentInvalid):
        validate_xml(data=flux_quotidien_caf_invalid)


async def test_validate_correct_file(flux_mensuel_caf: io.BufferedReader):
    assert validate_xml(data=flux_mensuel_caf)


async def test_extract_data_using_xml_tag_stream(
    flux_mensuel_caf: io.BufferedReader, snapshot
):
    (metadata, foyers) = parse_caf_file(flux_mensuel_caf)
    assert metadata
    assert metadata.date == date(2022, 3, 5)
    assert metadata.type == "M"
    assert len(foyers) == 2
    assert foyers == snapshot


rsa_right_test_data = [
    ("0", "rsa_demande_en_attente"),
    ("1", "rsa_refuse"),
    ("2", "rsa_droit_ouvert_versable"),
    ("3", "rsa_droit_ouvert_et_suspendu"),
    ("4", "rsa_droit_ouvert_versement_suspendu"),
    ("5", "rsa_clos"),
    ("6", "rsa_clos_anterieur"),
]


@pytest.mark.parametrize("a,expected", rsa_right_test_data)
def test_transform_right_rsa(a, expected):
    assert transform_right_rsa(a) == expected


class TestTranformRightRsa(TestCase):
    def test_transform_right_rsa_raise(self):
        self.assertRaises(KeyError, transform_right_rsa, "toto")


rsa_suspension_test_data = [
    ("01", "caf_ressources_trop_elevees"),
    ("02", "caf_moins_25_sans_personne_charge"),
    ("03", "caf_activite_non_conforme"),
    ("04", "caf_titre_sejour_invalid"),
    ("05", "caf_rsa_inferieur_seuil"),
    ("06", "caf_declaration_ressource_non_fournie"),
    ("09", "caf_residence_non_conforme"),
    ("19", "caf_pas_isolement"),
    ("31", "caf_prestation_exclue"),
    ("34", "caf_regime_non_conforme"),
    ("35", "caf_demande_avantage_vieillesse_absent"),
    ("36", "caf_titre_sejour_absent"),
    ("44", "caf_hospitalisation"),
    ("70", "caf_action_non_engagee"),
    ("78", "caf_surface_ponderee_sup"),
    ("84", "caf_droit_eteint"),
    ("85", "caf_pas_allocataire"),
    ("97", "caf_beneficiaire_aah"),
    ("AB", "caf_allocataire_absent"),
    ("CV", "caf_attente_decision_PCG"),
    ("CZ", "caf_activite_anterieur_insuffisante"),
    ("DA", "caf_activite_anterieure_absente"),
    ("DB", "caf_etudiant_remuneration_insuffisante"),
    ("DC", "caf_activite_anterieure_non_conforme"),
    (None, None),
    ("otot", None),
    (" DC ", "caf_activite_anterieure_non_conforme"),
]


@pytest.mark.parametrize("a,expected", rsa_suspension_test_data)
def test_transform_suspension_reason(a, expected):
    assert transform_suspension_reason(a) == expected


rsa_closure_test_data = [
    ("PCG", "caf_decision_pcg"),
    ("ECH", "caf_echeance"),
    ("EFF", "caf_annulation_bascule_rmi"),
    ("MUT", "caf_mutation"),
    ("RGD", "caf_regroupement"),
    ("RFD", "caf_radie_fin_droit"),
    ("RAU", "caf_radie_autre_motif"),
    ("RST", "caf_radie_option_rsta"),
    ("RSO", "caf_radie_option_rso"),
    (None, None),
    ("otot", None),
]


@pytest.mark.parametrize("a,expected", rsa_closure_test_data)
def test_transform_closure_reason(a, expected):
    assert transform_closure_reason(a) == expected


bool_test_data = [
    ("0", False),
    ("1", True),
]


@pytest.mark.parametrize("a,expected", bool_test_data)
def test_transform_bool(a, expected):
    assert transform_bool(a) == expected


def test_transform_cafMsaFoyer_to_beneficiary():
    personne = CafInfoPersonne(nir="1231231231231", soumis_droit_et_devoir=False)
    foyer = CafMsaInfosFoyer(
        date_cloture_rsa=None,
        motif_cloture_rsa=None,
        matricule="AAAAAAA",
        motif_suspension_versement_rsa=None,
        personnes=[personne],
        sans_domicile_fixe="0",
        etat_droit_rsa="2",
    )
    beneficiary = CdbBeneficiaryInfos(
        right_rsa="rsa_droit_ouvert_versable",
        caf_number="AAAAAAA",
        is_homeless=False,
        subject_right_and_duty=False,
        rsa_closure_date=None,
        rsa_closure_reason=None,
        rsa_suspension_reason=None,
    )

    assert transform_cafMsaFoyer_to_beneficiary(personne, foyer) == beneficiary
