from datetime import datetime

from asyncpg import Record
from dateutil.relativedelta import relativedelta

from cdb.api.db.crud.notebook_event import get_notebook_event_pe
from cdb.api.db.models.notebook import Notebook
from cdb.api.db.models.notebook_event import EventFrom, NotebookEvent
from cdb.cdb_csv.pe import compute_action_date, import_actions


async def test_parse_action_csv_correctly_imported(
    caplog, pe_action_csv_filepath: str, db_connection, notebook_sophie_tifour: Notebook
):

    await import_actions(db_connection, pe_action_csv_filepath)
    event_date = datetime.strptime("2021-07-05 00:00:00.0", "%Y-%m-%d %H:%M:%S.%f")

    notebook_event: NotebookEvent | None = await get_notebook_event_pe(
        db_connection,
        notebook_id=notebook_sophie_tifour.id,
        label="UNE FORMATION DANS LE DOMAINE ENGIN MANUTENTION LEVAGE",
        date=event_date,
    )

    assert notebook_event is not None
    assert notebook_event.event["from"] == "pole_emploi"
    assert (
        notebook_event.event["event_label"]
        == "UNE FORMATION DANS LE DOMAINE ENGIN MANUTENTION LEVAGE"
    )

    event_date = datetime.strptime("2013-11-06 00:00:00.0", "%Y-%m-%d %H:%M:%S.%f")

    notebook_event: NotebookEvent | None = await get_notebook_event_pe(
        db_connection,
        notebook_id=notebook_sophie_tifour.id,
        label="UNE AUTRE ACTION D'AIDE A LA REALISATION DE PROJET",
        date=event_date,
    )
    assert notebook_event is not None
    assert notebook_event.event["from"] == "pole_emploi"
    assert (
        notebook_event.event["event_label"]
        == "UNE AUTRE ACTION D'AIDE A LA REALISATION DE PROJET"
    )

    event_date = datetime.strptime("2012-11-19 00:00:00.0", "%Y-%m-%d %H:%M:%S.%f")

    notebook_event: NotebookEvent | None = await get_notebook_event_pe(
        db_connection,
        notebook_id=notebook_sophie_tifour.id,
        label="SUIVI DELEGUE A UN PARTENAIRE NON INFORMATISE",
        date=event_date,
    )

    assert notebook_event is not None
    assert notebook_event.event["from"] == "pole_emploi"
    assert (
        notebook_event.event["event_label"]
        == "SUIVI DELEGUE A UN PARTENAIRE NON INFORMATISE"
    )

    assert "Mapped focus not found for action" in caplog.text


async def test_actions_are_not_imported_twice(
    pe_action_csv_filepath: str, db_connection, notebook_sophie_tifour: Notebook
):
    await import_actions(db_connection, pe_action_csv_filepath)
    await import_actions(db_connection, pe_action_csv_filepath)

    records: list[Record] = await db_connection.fetch(
        """
        SELECT * from public.notebook_event WHERE notebook_id=$1
        AND event->>'from'=$2
        """,
        notebook_sophie_tifour.id,
        EventFrom.pe,
    )

    assert len(records) == 89


# See https://github.com/gip-inclusion/carnet-de-bord/issues/755#issuecomment-1265523681
async def test_compute_action_date():

    now = datetime.now()
    one_month_later = now + relativedelta(months=+1)
    two_month_later = now + relativedelta(months=+2)

    event_date = compute_action_date(
        date_prescription=now,
        date_realisation_action=None,
        date_fin=None,
        label="",
    )

    assert event_date == now

    # pour celle qui ont un date de fin et de réalisation en plus de la date de
    # prescription = afficher la date de réalisation (sauf UNE FORMATION DANS LE DOMAINE
    # SUIVANT)
    event_date = compute_action_date(
        date_prescription=now,
        date_realisation_action=one_month_later,
        date_fin=two_month_later,
        label="",
    )

    assert event_date == one_month_later

    # Pour "UNE FORMATION DANS LE DOMAINE SUIVANT" si date de fin plus date de
    # réalisation + libellé formation dans colonne "formation" = afficher la date de fin
    event_date = compute_action_date(
        date_prescription=now,
        date_realisation_action=None,
        date_fin=two_month_later,
        label="UNE FORMATION DANS LE DOMAINE SUIVANT",
    )
    assert event_date == two_month_later
