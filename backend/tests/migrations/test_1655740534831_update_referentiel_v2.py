import json
import os

import pytest
from asyncpg import Record
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
    "1655901967843_migrate_data_for_referentiel_v2",
    "up.sql",
)


async def test_add_action_ref(db_connection: Connection):
    record = await db_connection.fetch(
        """
            SELECT * FROM public.ref_action WHERE description = 'Travailler le CV'
        """
    )
    assert len(record) is 1


async def test_delete_ref_situation(db_connection: Connection):
    record = await db_connection.fetch(
        """
            SELECT id FROM public.ref_situation WHERE description='Prêt à en parler'
        """
    )
    assert len(record) is 0


async def test_update_ref_situation(db_connection: Connection):
    record = await db_connection.fetch(
        """
            SELECT id FROM public.ref_situation WHERE description='Prêt pour une formation'
        """
    )
    assert len(record) is 0
    record = await db_connection.fetch(
        """
            SELECT id FROM public.ref_situation WHERE description='Prêt à suivre une formation'
        """
    )
    assert len(record) is 1


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
            INSERT INTO public.notebook_focus (id, theme, creator_id, notebook_id, created_at, linked_to) VALUES ('f8b75201-97ec-4248-9dad-6f2bfb049b49', 'formation', '17434464-5f69-40cc-8172-40160958a33d', '9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d', '2021-09-21 13:33:16.96523+00', 'cer');
            """
        )
        # Load the migration
        with open(migration_filename, "r") as file:
            data = file.read()
            await connection.execute(data)

        yield connection
