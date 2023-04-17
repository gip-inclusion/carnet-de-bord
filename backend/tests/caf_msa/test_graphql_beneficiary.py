from datetime import date
from uuid import UUID

from asyncpg.connection import Connection
from gql.client import AsyncClientSession

from cdb.api.db.crud.external_data import get_external_data_with_query
from cdb.api.db.graphql.beneficiary import (
    get_beneficiary_by_nir,
    update_beneficiary,
)
from cdb.api.db.models.external_data import ExternalData
from cdb.caf_msa.parse_infos_foyer_rsa import CdbBeneficiaryInfos


async def test_get_beneficiary_by_nir(
    gql_manager_client: AsyncClientSession,
    sophie_tifour_beneficiary_id: UUID,
    sophie_tifour_nir: str,
):
    beneficiary = await get_beneficiary_by_nir(gql_manager_client, sophie_tifour_nir)

    assert beneficiary
    assert beneficiary.id == sophie_tifour_beneficiary_id
    assert beneficiary.right_rsa == "rsa_droit_ouvert_et_suspendu"
    assert beneficiary.rsa_closure_reason is None
    assert beneficiary.rsa_closure_date is None
    assert beneficiary.rsa_suspension_reason is None
    assert beneficiary.is_homeless is None
    assert beneficiary.subject_to_right_and_duty is None
    assert beneficiary.caf_number == "2055990"


async def test_update_beneficiary_by_id(
    gql_manager_client: AsyncClientSession, sophie_tifour_beneficiary_id: UUID
):
    personne = CdbBeneficiaryInfos(
        right_rsa="rsa_droit_ouvert_et_suspendu",
        rsa_closure_date=None,
        rsa_closure_reason=None,
        rsa_suspension_reason="caf_ressources_trop_eleve",
        is_homeless=False,
        subject_right_and_duty=False,
        caf_number="2055990",
    )

    sha = "123"
    external_data_payload = {"payload": "payload"}
    beneficiary = await update_beneficiary(
        gql_manager_client,
        sophie_tifour_beneficiary_id,
        personne,
        sha,
        external_data_payload,
    )
    assert beneficiary
    assert beneficiary.right_rsa == "rsa_droit_ouvert_et_suspendu"
    assert beneficiary.rsa_closure_reason is None
    assert beneficiary.rsa_closure_date is None
    assert beneficiary.rsa_suspension_reason == "caf_ressources_trop_eleve"
    assert beneficiary.is_homeless is False
    assert beneficiary.subject_to_right_and_duty is False


async def test_update_beneficiary_create_external_data(
    gql_manager_client: AsyncClientSession,
    db_connection: Connection,
    sophie_tifour_beneficiary_id: UUID,
    snapshot,
):
    personne = CdbBeneficiaryInfos(
        right_rsa="rsa_droit_ouvert_et_suspendu",
        rsa_closure_date=None,
        rsa_closure_reason=None,
        rsa_suspension_reason="caf_ressources_trop_eleve",
        is_homeless=False,
        subject_right_and_duty=False,
        caf_number="2055990",
    )

    sha = "123"
    external_data_payload = {"payload": "payload", "madate": date(2003, 2, 1)}
    beneficiary = await update_beneficiary(
        gql_manager_client,
        sophie_tifour_beneficiary_id,
        personne,
        sha,
        external_data_payload,
    )
    assert beneficiary
    external_data: ExternalData | None = await get_external_data_with_query(
        db_connection,
        "WHERE external_data_info.beneficiary_id = $1 "
        "AND external_data.source = $2 "
        "ORDER BY created_at DESC LIMIT 1",
        beneficiary.id,
        "cafmsa",
    )
    assert external_data
    assert external_data.data == snapshot


async def test_update_beneficiary_rsa_closure(
    gql_manager_client: AsyncClientSession, sophie_tifour_beneficiary_id: UUID
):
    personne = CdbBeneficiaryInfos(
        right_rsa="rsa_clot",
        rsa_closure_date="2023-01-01",
        rsa_closure_reason="caf_regroupement",
        rsa_suspension_reason=None,
        is_homeless=True,
        subject_right_and_duty=True,
        caf_number="XXXXXXXX",
    )
    sha = "123"
    external_data = {"payload": "payload"}
    beneficiary = await update_beneficiary(
        gql_manager_client,
        sophie_tifour_beneficiary_id,
        personne,
        sha,
        external_data,
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
    sophie_tifour_beneficiary_id: UUID,
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
    sha = "123"
    external_data = {"payload": "payload", "infos": {"madate": date(2003, 2, 1)}}
    beneficiary = await update_beneficiary(
        gql_manager_client,
        sophie_tifour_beneficiary_id,
        personne,
        sha,
        external_data,
    )
    assert beneficiary
    assert beneficiary.right_rsa == "rsa_droit_ouvert_et_suspendu"
    assert beneficiary.rsa_closure_reason is None
    assert beneficiary.rsa_closure_date is None
    assert beneficiary.rsa_suspension_reason == "caf_ressources_trop_eleve"
    assert beneficiary.is_homeless is False
    assert beneficiary.subject_to_right_and_duty is True
    assert beneficiary.caf_number == "XXXXXXXX"
