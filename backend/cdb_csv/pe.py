import logging

import dask.dataframe as dd
from pandas.core.series import Series

from api.core.db import get_connection_pool
from api.core.settings import settings
from api.db.crud.beneficiary import (
    find_wanted_job_for_beneficiary,
    get_beneficiary_from_csv,
)
from api.db.crud.rome_code import get_rome_code_by_label_and_code
from api.db.models.beneficiary import Beneficiary
from api.db.models.wanted_job import WantedJob
from cdb_csv.csv_row import PrincipalCsvRow

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
                        wanted_job_1: WantedJob | None = (
                            await find_wanted_job_for_beneficiary(
                                beneficiary, csv_row.rome_1, csv_row.rome_1_label
                            )
                        )

                        wanted_job_2: WantedJob | None = (
                            await find_wanted_job_for_beneficiary(
                                beneficiary, csv_row.rome_2, csv_row.rome_2_label
                            )
                        )

                        if not wanted_job_1:
                            pass

                        if not wanted_job_2:
                            pass

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
