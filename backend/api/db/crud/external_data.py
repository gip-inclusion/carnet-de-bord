import json
from uuid import UUID

from asyncpg import Record
from asyncpg.connection import Connection

from api.db.models.beneficiary import Beneficiary
from api.db.models.external_data import (
    ExternalData,
    ExternalDataInfo,
    ExternalDataInfoInsert,
    ExternalDataInsert,
    ExternalSource,
)
from cdb_csv.json import CustomEncoder


async def get_last_external_data_by_beneficiary_id(
    connection: Connection, beneficiary_id: UUID
) -> ExternalData | None:
    async with connection.transaction():

        external_data_record: Record | None = await connection.fetchrow(
            "SELECT external_data.*, external_data_info.created_at as info_created_at, "
            "external_data_info.updated_at as info_updated_at "
            "FROM external_data "
            "LEFT JOIN external_data_info "
            "ON external_data_info.external_data_id = external_data.id "
            "WHERE external_data_info.beneficiary_id = $1 "
            "ORDER BY created_at DESC",
            beneficiary_id,
        )

        if external_data_record:

            info = ExternalDataInfo(
                external_data_id=external_data_record["id"],
                beneficiary_id=beneficiary_id,
                created_at=external_data_record["info_created_at"],
                updated_at=external_data_record["info_updated_at"],
            )
            external_data = ExternalData(
                id=external_data_record["id"],
                source=external_data_record["source"],
                data=json.loads(external_data_record["data"]),
                created_at=external_data_record["created_at"],
                updated_at=external_data_record["updated_at"],
                info=info,
            )

            return external_data


async def insert_external_data(
    connection: Connection, external_data_insert: ExternalDataInsert
) -> ExternalData | None:

    v = await connection.fetchrow(
        """
            INSERT INTO public.external_data (source, data)
            VALUES ($1, $2) returning id, source, data, created_at, updated_at
            """,
        external_data_insert.source,
        json.dumps(external_data_insert.data, cls=CustomEncoder),
    )

    if v:
        external_data = ExternalData(
            id=v["id"],
            source=v["source"],
            data=json.loads(v["data"]),
            created_at=v["created_at"],
            updated_at=v["updated_at"],
        )

        return external_data


async def insert_external_data_info(
    connection: Connection, external_info_insert: ExternalDataInfoInsert
) -> ExternalDataInfo | None:

    v = await connection.fetchrow(
        """
            INSERT INTO public.external_data_info (external_data_id, beneficiary_id)
            VALUES ($1, $2) returning external_data_id, beneficiary_id, created_at, updated_at
            """,
        external_info_insert.external_data_id,
        external_info_insert.beneficiary_id,
    )

    if v:
        return ExternalDataInfo.parse_obj(v)


async def insert_external_data_for_beneficiary(
    connection: Connection,
    beneficiary: Beneficiary,
    source: ExternalSource,
) -> ExternalData | None:

    external_data_insert = ExternalDataInsert(source=source, data=beneficiary.dict())
    external_data: ExternalData | None = await insert_external_data(
        connection, external_data_insert
    )

    if external_data:
        external_info_insert = ExternalDataInfoInsert(
            external_data_id=external_data.id, beneficiary_id=beneficiary.id
        )
        external_info: ExternalDataInfo | None = await insert_external_data_info(
            connection, external_info_insert
        )
