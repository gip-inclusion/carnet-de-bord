from datetime import date

from api.db.crud.beneficiary import get_beneficiary_from_csv
from api.db.models.beneficiary import Beneficiary
from cdb_csv import pe
from cdb_csv.csv_row import PrincipalCsvRow


async def test_db_pool(pe_principal_csv_series, db_connection):

    # Get the first row
    _, series = next(pe_principal_csv_series.iterrows())
    csv_row: PrincipalCsvRow = await pe.map_principal_row(series)

    beneficiary: Beneficiary | None = await get_beneficiary_from_csv(
        db_connection, csv_row
    )

    assert beneficiary is not None

    if beneficiary:
        assert beneficiary.lastname == "Tifour"
        assert beneficiary.firstname == "Sophie"
        assert beneficiary.date_of_birth == date(1982, 2, 1)
