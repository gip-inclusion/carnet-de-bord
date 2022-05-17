from api.db.crud.external_data import get_last_external_data_by_beneficiary_id
from api.db.models.external_data import ExternalSource
from cdb_csv.pe import insert_external_data_for_beneficiary, parse_principal_csv_with_db


async def test_parse_principal_csv(pe_principal_csv_filepath, db_connection):

    await parse_principal_csv_with_db(db_connection, pe_principal_csv_filepath)

    assert True


async def test_insert_external_data(db_connection, beneficiary):
    await insert_external_data_for_beneficiary(
        db_connection, beneficiary, ExternalSource.PE
    )

    external_data = await get_last_external_data_by_beneficiary_id(
        db_connection, beneficiary.id
    )

    assert external_data is not None
    assert external_data.info is not None
    assert external_data.info.beneficiary_id == beneficiary.id
