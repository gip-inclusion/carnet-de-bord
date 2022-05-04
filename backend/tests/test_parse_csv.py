from cdb_csv.pe import parse_principal_csv_with_db


async def test_parse_principal_csv(pe_principal_csv_filepath, db_connection):

    await parse_principal_csv_with_db(db_connection, pe_principal_csv_filepath)

    assert True
