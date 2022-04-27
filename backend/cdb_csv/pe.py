import logging

import dask.dataframe as dd
from api.core.db import get_connection_pool
from api.core.settings import settings
from api.db.crud.beneficiary import get_beneficiary_from_csv
from api.db.crud.rome_code import get_rome_code_by_label_and_code
from api.db.models.beneficiary import Beneficiary
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

                csv_row: PrincipalCsvRow = await map_principal_row(row)

                if csv_row.brsa:

                    beneficiary: Beneficiary | None = await get_beneficiary_from_csv(
                        connection, csv_row
                    )

                    if beneficiary:
                        # Check ROME code
                        logging.info(
                            f"Checking ROME code for {beneficiary.id} - {csv_row}"
                        )
                        rome_code_1 = await get_rome_code_by_label_and_code(
                            connection, csv_row.rome_1_label, csv_row.rome_1
                        )
                        rome_code_2 = await get_rome_code_by_label_and_code(
                            connection, csv_row.rome_2_label, csv_row.rome_2
                        )

                        logging.info(rome_code_1)
                        logging.info(rome_code_2)

    else:
        logging.error("Unable to acquire connection from DB pool")


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
