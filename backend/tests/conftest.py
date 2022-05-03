import asyncio
import os

import dask.dataframe as dd
import pytest
from dask.dataframe.core import DataFrame

from api.core.db import get_connection_pool

test_dir = os.path.dirname(os.path.realpath(__file__))


@pytest.fixture
def seed_filepath() -> str:
    return os.path.join(
        test_dir, "..", "..", "hasura", "seeds", "carnet_de_bord", "seed-data.sql"
    )


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


@pytest.fixture
@pytest.mark.asyncio
async def db_connection(db_pool, seed_filepath):
    # Take a connection from the pool.
    if db_pool:

        async with db_pool.acquire() as connection:
            # Load the seeds

            with open(seed_filepath, "r") as file:
                data = file.read()
                await connection.execute(data)

            yield connection


@pytest.fixture
@pytest.mark.asyncio
async def db_pool():
    yield await get_connection_pool(
        os.getenv(
            "HASURA_GRAPHQL_DATABASE_URL",
            # You can't name your test database as you want. It has to be
            # carnet_de_bord otherwise you will not be able to apply
            # migrations with hasura
            "postgres://cdb:test@localhost:5433/carnet_de_bord",
        )
    )


@pytest.fixture
def event_loop():
    # See https://github.com/pytest-dev/pytest-asyncio/pull/214/files
    # https://github.com/MagicStack/asyncpg/issues/293
    return asyncio.get_event_loop_policy().get_event_loop()
    # return asyncio.get_event_loop()
