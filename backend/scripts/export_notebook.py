import asyncio
import logging
from uuid import UUID

import typer
from asyncpg.connection import Connection

from api.core.db import get_connection_pool
from api.core.settings import settings

logging.basicConfig(level=logging.INFO, format=settings.LOG_FORMAT)

app = typer.Typer()


async def export_structure(connection: Connection, structure_id: UUID):
    logging.info(f"Exporting structure {structure_id}")


async def export_structure_db(structure_id: UUID):
    pool = await get_connection_pool(settings.database_url)

    # Take a connection from the pool.
    if pool:
        async with pool.acquire() as connection:
            # Open a transaction.
            await export_structure(connection, structure_id)
    else:
        logging.error("Unable to acquire connection from DB pool")


@app.command()
def export_structure_main(structure_id: UUID):
    typer.echo(f"Exporting structure {structure_id}")

    asyncio.run(export_structure_db(structure_id))


if __name__ == "__main__":
    app()
