from asyncpg.connection import Connection

from cdb.api.db.crud.external_data import (
    get_all_external_datas_by_beneficiary_id_and_source,
    get_last_external_data_by_beneficiary_id_and_source,
)
from cdb.api.db.models.beneficiary import Beneficiary
from cdb.api.db.models.external_data import ExternalSource, format_external_data
from cdb.api.db.models.professional import Professional
from cdb.cdb_csv.models.csv_row import PrincipalCsvRow, get_sha256
from cdb.cdb_csv.pe import (
    insert_external_data_for_beneficiary_and_professional,
    map_principal_row,
    save_external_data,
)


async def test_insert_external_data(
    db_connection: Connection,
    beneficiary_sophie_tifour: Beneficiary,
    pe_principal_csv_series,
):
    # Get the first row
    _, row = next(pe_principal_csv_series.iterrows())
    csv_row: PrincipalCsvRow = await map_principal_row(row)

    await insert_external_data_for_beneficiary_and_professional(
        db_connection,
        beneficiary_sophie_tifour,
        ExternalSource.PE,
        format_external_data(
            csv_row.dict(), {"beneficiary": beneficiary_sophie_tifour.dict()}
        ),
        "myhash",
        professional=None,
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
    professional_pierre_chevalier: Professional,
    pe_principal_csv_series,
):
    external_data = await get_last_external_data_by_beneficiary_id_and_source(
        db_connection, beneficiary_sophie_tifour.id, ExternalSource.PE
    )

    assert external_data is None

    # Get the first row
    _, row = next(pe_principal_csv_series.iterrows())
    csv_row: PrincipalCsvRow = await map_principal_row(row)
    hash_result: str = await get_sha256(csv_row)

    external_data = await save_external_data(
        db_connection,
        beneficiary_sophie_tifour,
        csv_row,
        hash_result,
        professional=professional_pierre_chevalier,
    )

    assert external_data is not None
    assert external_data.info is not None
    assert external_data.data["parsed"]["beneficiary"]["lastname"] == "Tifour"
    assert external_data.data["parsed"]["professional"]["lastname"] == "Chevalier"
    assert external_data.data["source"]["nom"] == "TIFOUR"

    datas = await get_all_external_datas_by_beneficiary_id_and_source(
        db_connection, beneficiary_sophie_tifour.id, ExternalSource.PE
    )

    assert len(datas) == 1

    beneficiary_sophie_tifour.lastname = "Newname"
    csv_row.nom = "Newname"
    professional_pierre_chevalier.lastname = "Newlastname"
    hash_result: str = await get_sha256(csv_row)

    external_data = await save_external_data(
        db_connection,
        beneficiary_sophie_tifour,
        csv_row,
        hash_result,
        professional=professional_pierre_chevalier,
    )

    assert external_data is not None
    assert external_data.info is not None
    assert external_data.data["parsed"]["beneficiary"]["lastname"] == "Newname"
    assert external_data.data["parsed"]["professional"]["lastname"] == "Newlastname"
    assert external_data.data["source"]["nom"] == "Newname"

    assert (
        external_data.hash
        == "c288c50fec100107b74cc58090e4d682800fabbc0be456eb80b1aab23a820bc9"
    )

    datas = await get_all_external_datas_by_beneficiary_id_and_source(
        db_connection, beneficiary_sophie_tifour.id, ExternalSource.PE
    )

    assert len(datas) == 2
