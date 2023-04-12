import json

import pytest
from asyncpg.connection import Connection
from gql.client import AsyncClientSession

from cdb.api.db.crud.external_data import (
    get_all_external_datas_by_beneficiary_id_and_source,
    get_last_external_data_by_beneficiary_id_and_source,
    save_external_data_with_info,
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
        ExternalSource.PE_FTP,
        format_external_data(
            csv_row.dict(), {"beneficiary": beneficiary_sophie_tifour.dict()}
        ),
        "myhash",
        professional=None,
    )

    external_data = await get_last_external_data_by_beneficiary_id_and_source(
        db_connection, beneficiary_sophie_tifour.id, ExternalSource.PE_FTP
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
        db_connection, beneficiary_sophie_tifour.id, ExternalSource.PE_FTP
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
        db_connection, beneficiary_sophie_tifour.id, ExternalSource.PE_FTP
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
        == "8b816e2ff8b67d36c5432f0f1eb74c66cc4c50c616296969448639799ba02368"
    )

    datas = await get_all_external_datas_by_beneficiary_id_and_source(
        db_connection, beneficiary_sophie_tifour.id, ExternalSource.PE_FTP
    )

    assert len(datas) == 2


@pytest.mark.graphql
async def test_save_external_data_with_info(
    gql_admin_client: AsyncClientSession,
    db_connection: Connection,
    beneficiary_edwina_skinner: Beneficiary,
):
    data = {"test": "choucroute"}
    external_data_id = await save_external_data_with_info(
        gql_admin_client,
        beneficiary_edwina_skinner.id,
        data,
        ExternalSource.PE_IO,
    )
    result = await db_connection.fetchrow(
        """
        SELECT beneficiary_id, data, source, hash
        FROM external_data
        LEFT JOIN external_data_info ON external_data_id = id
        WHERE id = $1
        """,
        external_data_id,
    )
    assert result
    assert result["beneficiary_id"] == beneficiary_edwina_skinner.id
    assert result["data"] == json.dumps(data)
    assert (
        result["hash"]
        == "573836d0c6192bdebdaf246803617e7960a59f6c419dbc8e5dbc8912f85a4dd3"
    )
