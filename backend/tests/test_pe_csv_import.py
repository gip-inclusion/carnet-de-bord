from uuid import UUID

import httpx
import respx
from asyncpg.connection import Connection

from api.core.settings import settings
from api.db.crud.beneficiary import get_beneficiary_by_id
from api.db.crud.external_data import (
    get_last_external_data_by_beneficiary_id_and_source,
)
from api.db.crud.notebook import get_notebook_members_by_notebook_id
from api.db.crud.professional import get_professional_by_email
from api.db.models.beneficiary import Beneficiary
from api.db.models.external_data import ExternalSource
from api.db.models.notebook import NotebookMember
from cdb_csv.models.csv_row import PrincipalCsvRow
from cdb_csv.pe import (
    import_beneficiaries,
    insert_wanted_jobs_for_csv_row_and_notebook,
    map_principal_row,
)
from pe.pole_emploi_client import PoleEmploiApiClient
from tests.mocks.pole_emploi import PE_API_AGENCES_RESULT_OK_MOCK


@respx.mock
async def test_parse_principal_csv(
    pe_principal_csv_filepath: str,
    db_connection: Connection,
    beneficiary_sophie_tifour: Beneficiary,
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

    await import_beneficiaries(db_connection, pe_principal_csv_filepath)

    # External data should have been tracked
    external_data = await get_last_external_data_by_beneficiary_id_and_source(
        db_connection, beneficiary_sophie_tifour.id, ExternalSource.PE
    )

    assert external_data is not None and external_data.info is not None
    assert external_data.info.beneficiary_id == beneficiary_sophie_tifour.id
    assert (
        external_data.hash
        == "d10ed5fee17aa3cb36117a1d1eb1f4cd12514046c53bf8990f34d9d8233badd4"
    )

    sophie_tifour = await get_beneficiary_by_id(
        db_connection, UUID("c6e84ed6-eb31-47f0-bd71-9e4d7843cf0b")
    )

    assert sophie_tifour is not None and sophie_tifour.notebook is not None
    assert len(sophie_tifour.notebook.wanted_jobs) == 3

    professional = await get_professional_by_email(
        db_connection, "referent_prenom4.referent_nom4@pole-emploi.net"
    )

    assert professional is not None

    skinner_edwina = await get_beneficiary_by_id(
        db_connection, UUID("0af66131-727b-4d47-b0d2-92d363ed145b")
    )

    assert skinner_edwina is not None and skinner_edwina.notebook is not None

    notebook_members: list[NotebookMember] = await get_notebook_members_by_notebook_id(
        db_connection, skinner_edwina.notebook.id
    )

    assert len(notebook_members) == 1


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
