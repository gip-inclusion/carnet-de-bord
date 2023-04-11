from datetime import date
from uuid import UUID

from gql.client import AsyncClientSession

from cdb.api.db.graphql.beneficiary import (
    get_beneficiary_by_nir,
    update_beneficiary,
)
from cdb.caf_msa.parse_infos_foyer_rsa import CdbBeneficiaryInfos


async def test_get_beneficiary_by_nir(gql_manager_client: AsyncClientSession):
    beneficiary = await get_beneficiary_by_nir(gql_manager_client, "2820251108030")

    assert beneficiary
    assert beneficiary.id == UUID("c6e84ed6-eb31-47f0-bd71-9e4d7843cf0b")
    assert beneficiary.right_rsa == "rsa_droit_ouvert_et_suspendu"
    assert beneficiary.rsa_closure_reason is None
    assert beneficiary.rsa_closure_date is None
    assert beneficiary.rsa_suspension_reason is None
    assert beneficiary.is_homeless is None
    assert beneficiary.subject_to_right_and_duty is None
    assert beneficiary.caf_number == "2055990"


async def test_update_beneficiary_by_id(gql_manager_client: AsyncClientSession):
    personne = CdbBeneficiaryInfos(
        right_rsa="rsa_droit_ouvert_et_suspendu",
        rsa_closure_date=None,
        rsa_closure_reason=None,
        rsa_suspension_reason="caf_ressources_trop_eleve",
        is_homeless=False,
        subject_right_and_duty=False,
        caf_number="2055990",
    )
    beneficiary = await update_beneficiary(
        gql_manager_client, UUID("c6e84ed6-eb31-47f0-bd71-9e4d7843cf0b"), personne
    )
    assert beneficiary
    assert beneficiary.right_rsa == "rsa_droit_ouvert_et_suspendu"
    assert beneficiary.rsa_closure_reason is None
    assert beneficiary.rsa_closure_date is None
    assert beneficiary.rsa_suspension_reason == "caf_ressources_trop_eleve"
    assert beneficiary.is_homeless is False
    assert beneficiary.subject_to_right_and_duty is False


async def test_update_beneficiary_rsa_closure(gql_manager_client: AsyncClientSession):
    personne = CdbBeneficiaryInfos(
        right_rsa="rsa_clot",
        rsa_closure_date="2023-01-01",
        rsa_closure_reason="caf_regroupement",
        rsa_suspension_reason=None,
        is_homeless=True,
        subject_right_and_duty=True,
        caf_number="XXXXXXXX",
    )
    beneficiary = await update_beneficiary(
        gql_manager_client, UUID("c6e84ed6-eb31-47f0-bd71-9e4d7843cf0b"), personne
    )
    assert beneficiary
    assert beneficiary.right_rsa == "rsa_clot"
    assert beneficiary.rsa_closure_reason == "caf_regroupement"
    assert beneficiary.rsa_closure_date == date(2023, 1, 1)
    assert beneficiary.rsa_suspension_reason is None
    assert beneficiary.is_homeless is True
    assert beneficiary.subject_to_right_and_duty is True
    assert beneficiary.caf_number == "XXXXXXXX"


async def test_update_beneficiary_rsa_suspension(
    gql_manager_client: AsyncClientSession,
):
    personne = CdbBeneficiaryInfos(
        right_rsa="rsa_droit_ouvert_et_suspendu",
        rsa_closure_date=None,
        rsa_closure_reason=None,
        rsa_suspension_reason="caf_ressources_trop_eleve",
        is_homeless=False,
        subject_right_and_duty=True,
        caf_number="XXXXXXXX",
    )
    beneficiary = await update_beneficiary(
        gql_manager_client, UUID("c6e84ed6-eb31-47f0-bd71-9e4d7843cf0b"), personne
    )
    assert beneficiary
    assert beneficiary.right_rsa == "rsa_droit_ouvert_et_suspendu"
    assert beneficiary.rsa_closure_reason is None
    assert beneficiary.rsa_closure_date is None
    assert beneficiary.rsa_suspension_reason == "caf_ressources_trop_eleve"
    assert beneficiary.is_homeless is False
    assert beneficiary.subject_to_right_and_duty is True
    assert beneficiary.caf_number == "XXXXXXXX"
