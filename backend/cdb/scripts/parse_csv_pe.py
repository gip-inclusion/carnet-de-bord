import asyncio

import sentry_sdk
import typer

from cdb.cdb_csv import pe

sentry_sdk.init(attach_stacktrace=True)

app = typer.Typer()


@app.command()
def action_file(pe_action_file: str):
    typer.echo(f"Parsing action file {pe_action_file}")
    asyncio.run(pe.parse_pe_csv(pe_action_file, pe.ParseActionEnum.IMPORT_ACTIONS))


@app.command()
def principal_file(pe_principal_file: str):
    typer.echo(f"Parsing principal file {pe_principal_file}")
    asyncio.run(pe.parse_pe_csv(pe_principal_file))


if __name__ == "__main__":
    app()
