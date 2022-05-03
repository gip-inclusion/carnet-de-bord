from datetime import date

from api.db.crud.beneficiary import (
    find_wanted_job_for_beneficiary,
    get_beneficiary_from_csv,
)
from api.db.models.beneficiary import Beneficiary
from cdb_csv import pe
from cdb_csv.csv_row import PrincipalCsvRow


async def test_get_beneficiary_with_wanted_jobs(pe_principal_csv_series, db_connection):

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
        assert beneficiary.notebook is not None
        assert len(beneficiary.notebook.wanted_jobs) == 2

        assert (
            await find_wanted_job_for_beneficiary(
                beneficiary, csv_row.rome_1, csv_row.rome_1_label
            )
        ) is not None


async def test_get_beneficiary_without_wanted_jobs(
    pe_principal_csv_series, db_connection
):

    for idx, series in pe_principal_csv_series.iterrows():
        # Get the second element
        if idx == 1:

            csv_row: PrincipalCsvRow = await pe.map_principal_row(series)

            beneficiary: Beneficiary | None = await get_beneficiary_from_csv(
                db_connection, csv_row
            )

            assert beneficiary is not None

            if beneficiary:
                assert beneficiary.lastname == "Dorsey"
                assert beneficiary.firstname == "Hendrix"
                assert beneficiary.date_of_birth == date(1976, 12, 18)
                assert beneficiary.notebook is not None
                assert len(beneficiary.notebook.wanted_jobs) == 0

                assert (
                    await find_wanted_job_for_beneficiary(
                        beneficiary, csv_row.rome_1, csv_row.rome_1_label
                    )
                ) is None


async def test_get_beneficiary_without_notebook(pe_principal_csv_series, db_connection):

    for idx, series in pe_principal_csv_series.iterrows():
        # Get the second element
        if idx == 2:

            csv_row: PrincipalCsvRow = await pe.map_principal_row(series)

            print(csv_row)
            beneficiary: Beneficiary | None = await get_beneficiary_from_csv(
                db_connection, csv_row
            )

            assert beneficiary is not None

            if beneficiary:
                assert beneficiary.notebook is None
