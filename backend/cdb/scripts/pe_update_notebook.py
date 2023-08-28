import asyncio
import logging
from enum import Enum
from functools import partial
from uuid import UUID

import typer

from cdb.api.core.db import get_connection_pool
from cdb.api.core.settings import settings
from cdb.api.db.crud.notebook import get_notebook_ids_by_deployment_id
from cdb.api.db.crud.notebook_situation import get_ref_situations
from cdb.api.db.graphql.get_client import gql_client_backend_only
from cdb.api.v1.routers.pe_diagnostic.pe_diagnostic import (
    IO,
    update_notebook_from_pole_emploi,
)
from cdb.api.v1.routers.pe_diagnostic.pe_diagnostic_io import (
    find_notebook,
    get_dossier_pe,
    save_differences,
    save_in_external_data,
    update_diagnostic_fetch_date,
)

logging.basicConfig(level=logging.INFO, format=settings.LOG_FORMAT)


app = typer.Typer()


class Target(str, Enum):
    deployment = "deployment"
    notebook = "notebook"


async def update_pe_notebook(
    notebook_id: UUID, dry_run: bool, bypass_fresh_data_check: bool
):
    async with gql_client_backend_only() as session:
        IO.update_forward_refs()
        deps = IO(
            find_notebook=partial(find_notebook, session),
            get_dossier_pe=get_dossier_pe,
            update_diagnostic_fetch_date=partial(update_diagnostic_fetch_date, session),
            save_in_external_data=partial(save_in_external_data, session),
            get_ref_situations=partial(get_ref_situations, session),
            save_differences=partial(save_differences, session),
        )
        return await update_notebook_from_pole_emploi(
            deps, notebook_id, dry_run, bypass_fresh_data_check
        )


async def update_pe_notebook_for_deployment(
    deployment_id: UUID, dry_run: bool, bypass_fresh_data_check: bool
):
    pool = await get_connection_pool(settings.database_url)

    # Take a connection from the pool.
    if pool:
        async with pool.acquire() as connection:
            notebook_ids: list[UUID] = await get_notebook_ids_by_deployment_id(
                connection, deployment_id
            )

            for notebook_id in notebook_ids:
                await update_pe_notebook(notebook_id, dry_run, bypass_fresh_data_check)
    else:
        logging.error("Unable to acquire connection from DB pool")


@app.command()
def update_notebook_from_pe_by_id(
    target_id: UUID,
    target: Target = Target.notebook,
    dry_run: bool = True,
    bypass_fresh_data_check: bool = False,
    verbose: int = typer.Option(0, "--verbose", "-v", count=True),
):
    if verbose == 1:
        logging.getLogger().setLevel(logging.INFO)

    if verbose == 2:
        logging.getLogger().setLevel(logging.DEBUG)

    typer.echo(f"Updating {target} with id {target_id}")

    if target == Target.notebook:
        asyncio.run(update_pe_notebook(target_id, dry_run, bypass_fresh_data_check))
    else:
        asyncio.run(
            update_pe_notebook_for_deployment(
                target_id, dry_run, bypass_fresh_data_check
            )
        )


if __name__ == "__main__":
    app()
