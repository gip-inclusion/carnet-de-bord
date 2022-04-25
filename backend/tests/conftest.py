import asyncio
import os

import dask.dataframe as dd
import pytest
from api.core.db import get_connection_pool
from asyncpg.connection import Connection
from asyncpg.pool import Pool
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


@pytest.fixture(scope="session")
@pytest.mark.asyncio
async def db_connection(db_pool):
    # Take a connection from the pool.
    if db_pool:
        async with db_pool.acquire() as connection:
            # Open a transaction.
            yield connection


@pytest.fixture(scope="session")
@pytest.mark.asyncio
async def db_pool() -> Pool | None:
    return await get_connection_pool(
        os.getenv(
            "HASURA_GRAPHQL_DATABASE_URL",
            "postgres://cdb:test@localhost:5432/carnet_de_bord",
        )
    )


@pytest.fixture(scope="session")
def event_loop():
    # See https://github.com/pytest-dev/pytest-asyncio/pull/214/files
    # https://github.com/MagicStack/asyncpg/issues/293
    return asyncio.get_event_loop_policy().get_event_loop()
    # return asyncio.get_event_loop()
