from datetime import date

from cdb_csv import pe
from cdb_csv.csv_row import PrincipalCsvRow


async def test_csv_row(pe_principal_csv_series):

    # Get the first row
    _, series = next(pe_principal_csv_series.iterrows())
    res: PrincipalCsvRow = await pe.map_principal_row(series)
    assert res.title == "MME"
    assert res.last_name == "TIFOUR"
    assert res.first_name == "SOPHIE"
    assert res.place_of_birth == "LIEU NAISSANCE 1"
    assert res.date_of_birth == date(1982, 2, 1)
    assert res.rome_1 == "G1605"
    assert res.rome_1_label == "Aide de cuisine de collectivité"
    assert res.rome_2 == "K2204"
    assert res.rome_2_label == "Agent / Agente de nettoyage en collectivité"
