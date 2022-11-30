import logging
from unittest import mock
from uuid import UUID

import httpx
import respx
from asyncpg.connection import Connection
from dask.dataframe.core import DataFrame

from api.core.settings import settings
from api.db.crud.beneficiary import get_beneficiary_by_id
from api.db.crud.external_data import (
    get_last_external_data_by_beneficiary_id_and_source,
)
from api.db.crud.notebook import (
    get_notebook_member_by_notebook_id_and_account_id,
    get_notebook_members_by_notebook_id,
)
from api.db.crud.professional import get_professional_by_email
from api.db.crud.structure import get_structures
from api.db.models.beneficiary import Beneficiary
from api.db.models.external_data import ExternalSource
from api.db.models.notebook import NotebookMember
from api.db.models.professional import Professional
from api.db.models.structure import Structure
from cdb_csv.models.csv_row import PrincipalCsvRow
from cdb_csv.pe import (
    import_beneficiaries,
    import_pe_referent,
    insert_wanted_jobs_for_csv_row_and_notebook,
    map_principal_row,
    net_email_to_fr_email,
)
from pe.pole_emploi_client import PoleEmploiApiClient
from tests.mocks.pole_emploi import PE_API_AGENCES_RESULT_OK_MOCK


@respx.mock
async def test_parse_principal_csv(
    pe_principal_csv_filepath: str,
    db_connection: Connection,
    beneficiary_sophie_tifour: Beneficiary,
    beneficiary_hendrix_dorsey: Beneficiary,
    beneficiary_edwina_skinner: Beneficiary,
    caplog,
):

    client = PoleEmploiApiClient(
        auth_base_url=settings.PE_AUTH_BASE_URL,
        base_url=settings.PE_BASE_URL,
        client_id=settings.PE_CLIENT_ID,
        client_secret=settings.PE_CLIENT_SECRET,
        scope=settings.PE_SCOPE,
    )

    respx.post(client.token_url).mock(
        return_value=httpx.Response(
            200,
            json={
                "token_type": "foo",
                "access_token": "batman",
                "expires_in": 3600,
            },
        )
    )

    respx.get(client.agences_url).mock(
        return_value=httpx.Response(200, json=PE_API_AGENCES_RESULT_OK_MOCK)
    )

    assert beneficiary_sophie_tifour.notebook is not None
    assert len(beneficiary_sophie_tifour.notebook.wanted_jobs) == 2

    # Account of sanka@groupe-ns.fr
    notebook_member = await get_notebook_member_by_notebook_id_and_account_id(
        db_connection,
        beneficiary_hendrix_dorsey.notebook.id,
        UUID("a501db53-1b79-4a60-860b-5972bd184f98"),
    )

    assert notebook_member is None

    await import_beneficiaries(db_connection, pe_principal_csv_filepath)

    structures: list[Structure] = await get_structures(db_connection)
    # One structure should have been created (RETHEL)
    assert len(structures) == 12

    structure: None | Structure = next(
        (s for s in structures if s.name == "Agence P\\u00f4le emploi RETHEL"),
        None,
    )

    assert structure is not None

    # External data should have been tracked
    external_data = await get_last_external_data_by_beneficiary_id_and_source(
        db_connection, beneficiary_edwina_skinner.id, ExternalSource.PE
    )

    assert external_data is not None and external_data.info is not None
    assert external_data.data["parsed"]["beneficiary"] is not None
    assert external_data.data["parsed"]["professional"] is not None

    assert (
        external_data.data["parsed"]["professional"]["email"]
        == "referent_prenom4.referent_nom4@pole-emploi.fr"
    )

    assert (
        external_data.data["parsed"]["beneficiary"]["email"]
        == "edwina.skinner@commodo.com"
    )

    assert external_data.info.beneficiary_id == beneficiary_edwina_skinner.id
    assert (
        external_data.hash
        == "7ae664ec9134a62371c75c32f0a91a7162eac396a7f3db4119ea0b5eda88e380"
    )

    sophie_tifour = await get_beneficiary_by_id(
        db_connection, UUID("c6e84ed6-eb31-47f0-bd71-9e4d7843cf0b")
    )

    assert sophie_tifour is not None and sophie_tifour.notebook is not None
    assert len(sophie_tifour.notebook.wanted_jobs) == 3
    assert sophie_tifour.pe_unique_import_id == "71288a46-3c4d-4372-9298-c32936d7e76d"

    professional = await get_professional_by_email(
        db_connection, "referent_prenom4.referent_nom4@pole-emploi.fr"
    )

    assert professional is not None

    skinner_edwina = await get_beneficiary_by_id(
        db_connection, UUID("0af66131-727b-4d47-b0d2-92d363ed145b")
    )

    assert skinner_edwina is not None and skinner_edwina.notebook is not None

    notebook_members: list[NotebookMember] = await get_notebook_members_by_notebook_id(
        db_connection, skinner_edwina.notebook.id
    )

    assert len(notebook_members) == 2

    # Account of sanka@groupe-ns.fr
    notebook_member = await get_notebook_member_by_notebook_id_and_account_id(
        db_connection,
        beneficiary_hendrix_dorsey.notebook.id,
        UUID("a501db53-1b79-4a60-860b-5972bd184f98"),
    )

    assert notebook_member is not None

    # Running it twice with the same input file should result in Skipping
    # the imports due to SHA 256 check

    with caplog.at_level(logging.INFO):
        await import_beneficiaries(db_connection, pe_principal_csv_filepath)

        assert (
            "71288a46-3c4d-4372-9298-c32936d7e76d - SHA value is the same."
            in caplog.text
        )

        assert (
            "63e09252-fc80-409d-9617-cb8d7aeb620c - SHA value is the same."
            in caplog.text
        )
        assert (
            "9cf3e10e-8894-4527-ace3-40c30a65fdc7 - SHA value is the same."
            in caplog.text
        )


async def test_insert_wanted_jobs_for_csv_row_and_notebook(
    db_connection: Connection,
    pe_principal_csv_series,
    beneficiary_sophie_tifour: Beneficiary,
):

    assert beneficiary_sophie_tifour.notebook is not None
    assert len(beneficiary_sophie_tifour.notebook.wanted_jobs) == 2

    # Get the first row
    _, row = next(pe_principal_csv_series.iterrows())
    csv_row: PrincipalCsvRow = await map_principal_row(row)

    if beneficiary_sophie_tifour.notebook:
        updated_notebook = await insert_wanted_jobs_for_csv_row_and_notebook(
            db_connection,
            csv_row,
            beneficiary_sophie_tifour.notebook,
            row["identifiant_unique_de"],
        )

        assert len(updated_notebook.wanted_jobs) == 3

        sophie_tifour = await get_beneficiary_by_id(
            db_connection, UUID("c6e84ed6-eb31-47f0-bd71-9e4d7843cf0b")
        )

        assert sophie_tifour is not None and sophie_tifour.notebook is not None
        assert len(sophie_tifour.notebook.wanted_jobs) == 3


@mock.patch("cdb_csv.pe.map_principal_row", side_effect=Exception("Parsing exception"))
async def test_parse_principal_csv_exception(
    mock_principal_row,
    pe_principal_csv_filepath: str,
    db_connection: Connection,
    caplog,
):
    await import_beneficiaries(db_connection, pe_principal_csv_filepath)

    # Every line of the CSV file should have been called
    assert mock_principal_row.call_count == 4

    with caplog.at_level(logging.ERROR):
        await import_beneficiaries(db_connection, pe_principal_csv_filepath)

        assert (
            "Exception while processing main CSV line: Parsing exception" in caplog.text
        )


async def test_email_conversion():
    assert (
        net_email_to_fr_email("051referent_prenom4.referent_nom4@pole-emploi.net")
        == "referent_prenom4.referent_nom4@pole-emploi.fr"
    )


async def test_import_pe_referent(
    db_connection: Connection, pe_principal_csv_series: DataFrame
):
    rows = list(pe_principal_csv_series.iterrows())

    _, row_content = rows[3]

    csv_row: PrincipalCsvRow = await map_principal_row(row_content)

    professional: Professional | None = await import_pe_referent(
        db_connection,
        csv_row,
        csv_row.identifiant_unique_de,
        UUID("4dab8036-a86e-4d5f-9bd4-6ce88c1940d0"),
        UUID("9c0e5236-a03d-4e5f-b945-c6bc556cf9f3"),
    )

    assert professional is not None
    assert professional.email == "referent_prenom4.referent_nom4@pole-emploi.fr"
