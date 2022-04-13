import asyncio

import typer
from cdb_csv import pe

app = typer.Typer()


@app.command()
def action_file(pe_action_file: str):
    typer.echo(f"Parsing action file {pe_action_file}")


@app.command()
def principal_file(pe_principal_file: str):
    typer.echo(f"Parsing principal file {pe_principal_file}")
    asyncio.run(pe.parse_principal_csv(pe_principal_file))


if __name__ == "__main__":
    app()
