import logging

import dask.dataframe as dd
from asyncpg.connection import Connection
from pandas.core.series import Series

from api.core.db import get_connection_pool
from api.core.settings import settings
from api.db.crud.beneficiary import get_beneficiary_from_csv
from api.db.crud.wanted_job import (
    find_wanted_job_for_notebook,
    insert_wanted_job_for_notebook,
)
from api.db.models.beneficiary import Beneficiary
from api.db.models.notebook import Notebook
from api.db.models.wanted_job import WantedJob
from cdb_csv.csv_row import PrincipalCsvRow

logging.basicConfig(level=logging.INFO)


async def parse_principal_csv_with_db(connection: Connection, principal_csv: str):

    df = dd.read_csv(principal_csv, sep=";")

    row: Series
    for _, row in df.iterrows():

        csv_row: PrincipalCsvRow = await map_principal_row(row)

        if csv_row.brsa:

            beneficiary: Beneficiary | None = await get_beneficiary_from_csv(
                connection, csv_row
            )

            if beneficiary and beneficiary.notebook is not None:
                for (rome_code, rome_label) in [
                    (csv_row.rome_1, csv_row.rome_1_label),
                    (csv_row.rome_2, csv_row.rome_2_label),
                ]:
                    await check_and_insert_wanted_job(
                        connection,
                        beneficiary.notebook,
                        rome_code,
                        rome_label,
                    )


async def parse_principal_csv(principal_csv: str):
    pool = await get_connection_pool(settings.hasura_graphql_database_url)

    # Take a connection from the pool.
    if pool:
        async with pool.acquire() as connection:
            # Open a transaction.

            await parse_principal_csv_with_db(connection, principal_csv)
    else:
        logging.error("Unable to acquire connection from DB pool")


async def check_and_insert_wanted_job(
    connection: Connection, notebook: Notebook, rome_code: str, rome_label: str
) -> WantedJob | None:
    """
    Returns the inserted WantedJob or None if the job was not inserted
    """

    wanted_job: WantedJob | None = await find_wanted_job_for_notebook(
        notebook, rome_code, rome_label
    )

    if not wanted_job:
        return await insert_wanted_job_for_notebook(
            connection, notebook, rome_code, rome_label
        )


async def map_principal_row(row: Series) -> PrincipalCsvRow:
    return PrincipalCsvRow(
        unique_id=row["identifiant_unique_de"],
        title=row["civilite"],
        first_name=row["prenom"],
        last_name=row["nom"],
        place_of_birth=row["lieu_naissance"],
        date_of_birth=row["date_naissance"],
        rome_1=row["rome_1"],
        rome_1_label=row["appelation_rome_1"],
        rome_2=row["rome_2"],
        rome_2_label=row["appelation_rome_2"],
        brsa=row["brsa"],
    )
