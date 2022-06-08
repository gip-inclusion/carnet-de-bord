import logging

import dask.dataframe as dd
from asyncpg.connection import Connection
from pandas.core.series import Series

from api.core.db import get_connection_pool
from api.core.settings import settings
from api.db.crud.beneficiary import get_beneficiary_from_personal_information
from api.db.crud.external_data import (
    get_last_external_data_by_beneficiary_id_and_source,
    insert_external_data_for_beneficiary,
    update_external_data,
)
from api.db.crud.professional import get_professional_from_csv, insert_professional
from api.db.crud.wanted_job import (
    find_wanted_job_for_notebook,
    insert_wanted_job_for_notebook,
)
from api.db.models.beneficiary import Beneficiary
from api.db.models.external_data import (
    ExternalData,
    ExternalSource,
    format_external_data,
)
from api.db.models.notebook import Notebook
from api.db.models.professional import Professional, ProfessionalInsert
from api.db.models.wanted_job import WantedJob
from cdb_csv.models.csv_row import PrincipalCsvRow, get_sha256

FORMAT = "[%(asctime)s:%(filename)s:%(lineno)s - %(funcName)20s() ] %(message)s"
logging.basicConfig(level=logging.INFO, format=FORMAT)


async def parse_principal_csv_with_db(connection: Connection, principal_csv: str):

    df = dd.read_csv(
        principal_csv, sep=";", dtype=str, keep_default_na=False, na_values=["_"]
    )

    row: Series
    for _, row in df.iterrows():

        logging.info(
            "{id} - Trying to import main row {id}".format(
                id=row["identifiant_unique_de"]
            )
        )

        csv_row: PrincipalCsvRow = await map_principal_row(row)

        if csv_row.brsa:
            await import_beneficiary(connection, csv_row, row["identifiant_unique_de"])

            await import_pe_referent(connection, csv_row, row["identifiant_unique_de"])
        else:
            logging.info(
                "{} - Skipping, BRSA field is No for".format(
                    row["identifiant_unique_de"]
                )
            )


async def import_pe_referent(
    connection: Connection, csv_row: PrincipalCsvRow, pe_unique_id: str
):

    professional: Professional | None = await get_professional_from_csv(
        connection, csv_row
    )
    if not professional:
        # @TODO: query PE API
        # await insert_professional(connection, ProfessionalInsert(…))
        pass
    else:
        logging.info("{} - Professional already exists".format(pe_unique_id))


async def import_beneficiary(
    connection: Connection, csv_row: PrincipalCsvRow, pe_unique_id: str
):

    beneficiary: Beneficiary | None = await get_beneficiary_from_personal_information(
        connection,
        firstname=csv_row.prenom,
        lastname=csv_row.nom,
        birth_date=csv_row.date_naissance,
    )

    if beneficiary and beneficiary.notebook is not None:

        logging.info(
            "{} - Found matching beneficiary {}".format(pe_unique_id, beneficiary.id)
        )

        # Insert the missing wanted jobs into the DB
        beneficiary.notebook = await insert_wanted_jobs_for_csv_row_and_notebook(
            connection,
            csv_row,
            beneficiary.notebook,
            pe_unique_id,
        )

        # Keep track of the data we want to insert
        await save_external_data(connection, beneficiary, csv_row)
    else:
        logging.info(
            "{} - No matching beneficiary with notebook found".format(pe_unique_id)
        )


async def save_external_data(
    connection: Connection, beneficiary: Beneficiary, csv_row: PrincipalCsvRow
) -> ExternalData | None:

    # Do we already have some external data for this beneficiary?
    external_data: ExternalData | None = (
        await get_last_external_data_by_beneficiary_id_and_source(
            connection, beneficiary.id, ExternalSource.PE
        )
    )

    hash_result: str = await get_sha256(csv_row)

    if external_data is None:
        # If not, we should insert it

        logging.info("No external_data for {}".format(beneficiary.id))
        external_data: ExternalData | None = await insert_external_data_for_beneficiary(
            connection,
            beneficiary,
            ExternalSource.PE,
            format_external_data(csv_row.dict(), {"beneficiary": beneficiary.dict()}),
            hash_result,
        )
    elif hash_result != external_data.hash:
        # If we have some and the new content is different, let's update it.

        external_data.hash = hash_result

        logging.info("Found external_data for {}".format(beneficiary.id))
        logging.info(external_data)
        external_data.data = format_external_data(
            csv_row.dict(), {"beneficiary": beneficiary.dict()}
        )
        updated_external_data: ExternalData | None = await update_external_data(
            connection, external_data
        )

        external_data = updated_external_data

    return external_data


async def parse_principal_csv(principal_csv: str):
    pool = await get_connection_pool(settings.database_url)

    # Take a connection from the pool.
    if pool:
        async with pool.acquire() as connection:
            # Open a transaction.

            await parse_principal_csv_with_db(connection, principal_csv)
    else:
        logging.error("Unable to acquire connection from DB pool")


async def insert_wanted_jobs_for_csv_row_and_notebook(
    connection: Connection,
    csv_row: PrincipalCsvRow,
    notebook: Notebook,
    unique_identifier: str,
) -> Notebook:

    for (rome_code, rome_label) in [
        (csv_row.rome_1, csv_row.appelation_rome_1),
        (csv_row.rome_2, csv_row.appelation_rome_2),
    ]:
        wanted_job: WantedJob | None = await check_and_insert_wanted_job(
            connection,
            notebook,
            rome_code,
            rome_label,
        )
        if wanted_job:
            logging.info(
                "{} - Wanted job {} inserted".format(unique_identifier, wanted_job)
            )
            notebook.wanted_jobs.append(wanted_job)
        else:
            logging.info("{} - NO Wanted job inserted".format(unique_identifier))

    return notebook


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
        logging.info(
            "Wanted job {} - {} not found for notebook {}".format(
                rome_code, rome_label, notebook.id
            )
        )
        return await insert_wanted_job_for_notebook(
            connection, notebook, rome_code, rome_label
        )
    else:
        logging.info("Wanted job {} found for notebook".format(wanted_job))


async def map_principal_row(row: Series) -> PrincipalCsvRow:
    return PrincipalCsvRow.parse_obj(row)
