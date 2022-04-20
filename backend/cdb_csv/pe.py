import logging

import dask.dataframe as dd
from api.core.db import get_connection_pool
from api.core.settings import settings
from api.db.beneficiary import get_beneficiary_from_csv
from cdb_csv.csv_row import PrincipalCsvRow
from pandas.core.series import Series

logging.basicConfig(level=logging.INFO)


async def parse_principal_csv(principal_csv: str):
    pool = await get_connection_pool(settings.hasura_graphql_database_url)

    # Take a connection from the pool.
    if pool:
        async with pool.acquire() as connection:
            # Open a transaction.

            df = dd.read_csv(principal_csv, sep=";")

            row: Series
            for _, row in df.iterrows():

                csv_row: PrincipalCsvRow = await map_row(row)

                await get_beneficiary_from_csv(connection, csv_row)

    else:
        logging.error("Unable to acquire connection from DB pool")


async def map_row(row: Series) -> PrincipalCsvRow:
    return PrincipalCsvRow(
        title=row["civilite"],
        first_name=row["prenom"],
        last_name=row["nom"],
        place_of_birth=row["lieu_naissance"],
        date_of_birth=row["date_naissance"],
    )
