import asyncio

import sentry_sdk
import typer

from cdb_csv import pe

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


@app.command()
def attach_pro_to_beneficiary(pe_principal_file: str):
    typer.echo(f"Attaching pro to beneficiary from principal file {pe_principal_file}")
    asyncio.run(
        pe.parse_pe_csv(
            pe_principal_file, pe.ParseActionEnum.MATCH_BENEFICIARIES_AND_PROS
        )
    )


if __name__ == "__main__":
    app()
