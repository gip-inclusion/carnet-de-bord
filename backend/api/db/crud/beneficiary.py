from api.db.models.beneficiary import Beneficiary
from asyncpg import Record
from asyncpg.connection import Connection
from cdb_csv.csv_row import PrincipalCsvRow


async def get_beneficiary_from_csv(
    connection: Connection, csv_row: PrincipalCsvRow
) -> Beneficiary | None:

    async with connection.transaction():

        beneficiary_record: Record | None = await connection.fetchrow(
            "SELECT * FROM public.beneficiary WHERE "
            "LOWER(public.beneficiary.firstname) = LOWER($1) AND "
            "LOWER(public.beneficiary.lastname) = LOWER($2) AND "
            "public.beneficiary.date_of_birth = $3",
            csv_row.first_name,
            csv_row.last_name,
            csv_row.date_of_birth,
        )

        if beneficiary_record:
            return Beneficiary.parse_obj(beneficiary_record)
