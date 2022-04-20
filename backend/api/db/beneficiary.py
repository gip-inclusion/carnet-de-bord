import logging

from asyncpg import Record
from asyncpg.connection import Connection
from cdb_csv.csv_row import PrincipalCsvRow


async def get_beneficiary_from_csv(connection: Connection, csv_row: PrincipalCsvRow):
    logging.info(f"Looking for beneficiary: {csv_row}")

    async with connection.transaction():

        beneficiary: Record | None = await connection.fetchrow(
            "SELECT * FROM public.beneficiary WHERE "
            "LOWER(public.beneficiary.firstname) = LOWER($1) AND "
            "LOWER(public.beneficiary.lastname) = LOWER($2) AND "
            "public.beneficiary.date_of_birth = $3",
            csv_row.first_name,
            csv_row.last_name,
            csv_row.date_of_birth,
        )

        print(beneficiary)
