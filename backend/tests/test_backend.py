from datetime import date

from cdb_csv import pe
from cdb_csv.csv_row import PrincipalCsvRow


async def test_csv_row(pe_principal_csv_series):

    # Get the first row
    _, series = next(pe_principal_csv_series.iterrows())
    res: PrincipalCsvRow = await pe.map_row(series)
    assert res.title == "MME"
    assert res.last_name == "NOM_DE_1"
    assert res.first_name == "PRENOM_DE_1"
    assert res.place_of_birth == "LIEU NAISSANCE 1"
    assert res.date_of_birth == date(1967, 4, 30)
