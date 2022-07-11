import os

import pytest
from asyncpg.connection import Connection
from asyncpg.pool import Pool

current_dir = os.path.dirname(os.path.realpath(__file__))
migration_filename = os.path.join(
    current_dir,
    "..",
    "..",
    "..",
    "hasura",
    "migrations",
    "carnet_de_bord",
    "1657183288078_remove_cdd_cdi",
    "up.sql",
)


async def test_update_cdd(connection: Connection):
    cdd_record = await connection.fetch(
        """
            SELECT * FROM public.notebook WHERE work_situation = 'cdd'
        """
    )
    assert len(cdd_record) == 0
    cdd_tp_record = await connection.fetch(
        """
            SELECT * FROM public.notebook WHERE work_situation = 'cdd_temps_plein'
        """
    )
    assert len(cdd_tp_record) == 1


async def test_update_cdi(connection: Connection):
    cdi_record = await connection.fetch(
        """
            SELECT * FROM public.notebook WHERE work_situation = 'cdi'
        """
    )
    assert len(cdi_record) == 0
    cdi_tp_record = await connection.fetch(
        """
            SELECT * FROM public.notebook WHERE work_situation = 'cdi_temps_plein'
        """
    )
    assert len(cdi_tp_record) == 1


@pytest.fixture
@pytest.mark.asyncio
async def connection(db_pool: Pool, seed_filepath: str):
    async with db_pool.acquire() as connection:
        # Load the seeds
        with open(seed_filepath, "r") as file:
            data = file.read()
            await connection.execute(data)
        await connection.fetch(
            """
            UPDATE notebook SET work_situation = 'cdd' WHERE id= '24e335cb-4e2b-481b-84b7-617d77f60f56';
            """
        )
        await connection.fetch(
            """
            UPDATE notebook SET work_situation = 'cdi' WHERE id= '879a25f0-e10c-4081-bde3-4aef77826d1a';
            """
        )
        # Load the migration
        with open(migration_filename, "r") as file:
            data = file.read()
            await connection.execute(data)

        yield connection
