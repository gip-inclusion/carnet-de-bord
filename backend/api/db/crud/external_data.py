import json

from asyncpg.connection import Connection

from api.db.models.external_data import ExternalDataInsert
from cdb_csv.json import CustomEncoder


async def insert_external_data(
    connection: Connection, external_data: ExternalDataInsert
) -> None:

    await connection.execute(
        """
            INSERT INTO public.external_data (source, data, account_id)
            VALUES ($1, $2, $3)
            """,
        external_data.source,
        json.dumps(external_data.data, cls=CustomEncoder),
        external_data.account_id,
    )
