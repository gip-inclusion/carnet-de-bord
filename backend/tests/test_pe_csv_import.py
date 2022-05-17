from api.db.crud.external_data import (
    get_last_external_data_by_beneficiary_id_and_source,
)
from api.db.models.external_data import ExternalSource
from cdb_csv.pe import (
    check_existing_external_data,
    insert_external_data_for_beneficiary,
    parse_principal_csv_with_db,
)


async def test_parse_principal_csv(
    pe_principal_csv_filepath, db_connection, beneficiary_sophie_tifour
):

    await parse_principal_csv_with_db(db_connection, pe_principal_csv_filepath)

    # External data should have been tracked
    external_data = await get_last_external_data_by_beneficiary_id_and_source(
        db_connection, beneficiary_sophie_tifour.id, ExternalSource.PE
    )

    assert external_data is not None
    assert external_data.info is not None
    assert external_data.info.beneficiary_id == beneficiary_sophie_tifour.id


async def test_insert_external_data(db_connection, beneficiary_sophie_tifour):
    await insert_external_data_for_beneficiary(
        db_connection, beneficiary_sophie_tifour, ExternalSource.PE
    )

    external_data = await get_last_external_data_by_beneficiary_id_and_source(
        db_connection, beneficiary_sophie_tifour.id, ExternalSource.PE
    )

    assert external_data is not None
    assert external_data.info is not None
    assert external_data.info.beneficiary_id == beneficiary_sophie_tifour.id


async def test_check_existing_external_data(db_connection, beneficiary_sophie_tifour):
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

    external_data = await check_existing_external_data(
        db_connection, beneficiary_sophie_tifour
    )

    assert external_data is not None
    assert external_data.info is not None
    assert external_data.data["lastname"] == "Newname"
