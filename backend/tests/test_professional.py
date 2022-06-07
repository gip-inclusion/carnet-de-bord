from api.db.crud.professional import get_professional_from_csv
from api.db.models.professional import Professional
from cdb_csv import pe
from cdb_csv.csv_row import PrincipalCsvRow


async def test_get_professional_from_csv(pe_principal_csv_series, db_connection):

    # Get the first row
    _, series = next(pe_principal_csv_series.iterrows())
    csv_row: PrincipalCsvRow = await pe.map_principal_row(series)

    professional: Professional | None = await get_professional_from_csv(
        db_connection, csv_row
    )

    assert professional is not None

    assert professional.email == "sanka@groupe-ns.fr"
    assert professional.lastname == "Anka"
    assert professional.firstname == "Simon"
