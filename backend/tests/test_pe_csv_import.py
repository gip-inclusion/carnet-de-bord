from uuid import UUID

from asyncpg.connection import Connection

from api.db.crud.beneficiary import get_beneficiary_by_id
from api.db.crud.external_data import (
    get_last_external_data_by_beneficiary_id_and_source,
)
from api.db.models.beneficiary import Beneficiary
from api.db.models.external_data import ExternalSource
from cdb_csv.csv_row import PrincipalCsvRow
from cdb_csv.pe import (
    insert_existing_external_data,
    insert_external_data_for_beneficiary,
    insert_wanted_jobs_for_csv_row_and_notebook,
    map_principal_row,
    parse_principal_csv_with_db,
)


async def test_parse_principal_csv(
    pe_principal_csv_filepath: str,
    db_connection: Connection,
    beneficiary_sophie_tifour: Beneficiary,
):

    assert beneficiary_sophie_tifour.notebook is not None
    assert len(beneficiary_sophie_tifour.notebook.wanted_jobs) == 2

    await parse_principal_csv_with_db(db_connection, pe_principal_csv_filepath)

    # External data should have been tracked
    external_data = await get_last_external_data_by_beneficiary_id_and_source(
        db_connection, beneficiary_sophie_tifour.id, ExternalSource.PE
    )

    assert external_data is not None and external_data.info is not None
    assert external_data.info.beneficiary_id == beneficiary_sophie_tifour.id

    sophie_tifour = await get_beneficiary_by_id(
        db_connection, UUID("c6e84ed6-eb31-47f0-bd71-9e4d7843cf0b")
    )

    assert sophie_tifour is not None and sophie_tifour.notebook is not None
    assert len(sophie_tifour.notebook.wanted_jobs) == 3


async def test_insert_external_data(
    db_connection: Connection, beneficiary_sophie_tifour: Beneficiary
):
    await insert_external_data_for_beneficiary(
        db_connection, beneficiary_sophie_tifour, ExternalSource.PE
    )

    external_data = await get_last_external_data_by_beneficiary_id_and_source(
        db_connection, beneficiary_sophie_tifour.id, ExternalSource.PE
    )

    assert external_data is not None
    assert external_data.info is not None
    assert external_data.info.beneficiary_id == beneficiary_sophie_tifour.id


async def test_check_existing_external_data(
    db_connection: Connection,
    beneficiary_sophie_tifour: Beneficiary,
):

    external_data = await get_last_external_data_by_beneficiary_id_and_source(
        db_connection, beneficiary_sophie_tifour.id, ExternalSource.PE
    )

    assert external_data is None

    external_data = await insert_external_data_for_beneficiary(
        db_connection, beneficiary_sophie_tifour, ExternalSource.PE
    )

    assert external_data is not None
    assert external_data.info is not None
    assert external_data.data["lastname"] == "Tifour"

    beneficiary_sophie_tifour.lastname = "Newname"

    external_data = await insert_existing_external_data(
        db_connection, beneficiary_sophie_tifour
    )

    assert external_data is not None
    assert external_data.info is not None
    assert external_data.data["lastname"] == "Newname"


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
