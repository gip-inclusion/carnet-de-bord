import os

import dask.dataframe as dd
import pytest
from dask.dataframe.core import DataFrame

test_dir = os.path.dirname(os.path.realpath(__file__))


@pytest.fixture
def pe_principal_csv_filepath() -> str:
    return os.path.join(
        test_dir,
        "fixtures",
        "i03300c.j.extract_spie_carnet_spie_carnet_de_bord_principal.csv",
    )


@pytest.fixture
def pe_principal_csv_series(pe_principal_csv_filepath) -> DataFrame:

    return dd.read_csv(pe_principal_csv_filepath, sep=";")
