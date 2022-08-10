import asyncio
import json
import logging
from uuid import UUID

import typer
from asyncpg.connection import Connection

from api.core.db import get_connection_pool
from api.core.settings import settings
from api.db.crud.notebook import get_notebooks_by_structure_id
from api.db.crud.out import notebook_to_out
from api.db.models.notebook import Notebook
from api.db.models.out import NotebookOut

logging.basicConfig(level=logging.INFO, format=settings.LOG_FORMAT)

app = typer.Typer()


async def export_notebooks_from_structure(connection: Connection, structure_id: UUID):
    logging.info(f"Exporting structure {structure_id}")

    notebooks: list[Notebook] = await get_notebooks_by_structure_id(
        connection, structure_id
    )

    notebooks_out: list[NotebookOut] = [
        (await notebook_to_out(connection, notebook)).json() for notebook in notebooks
    ]

    print(NotebookOut.schema_json(indent=2))


async def export_notebooks_from_structure_db(structure_id: UUID):
    pool = await get_connection_pool(settings.database_url)

    # Take a connection from the pool.
    if pool:
        async with pool.acquire() as connection:
            # Open a transaction.
            await export_notebooks_from_structure(connection, structure_id)
    else:
        logging.error("Unable to acquire connection from DB pool")


@app.command()
def export_notebooks_from_structure_main(structure_id: UUID):
    typer.echo(f"Exporting structure {structure_id}")

    asyncio.run(export_notebooks_from_structure_db(structure_id))


if __name__ == "__main__":
    app()
