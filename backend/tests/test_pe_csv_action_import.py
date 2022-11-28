from datetime import datetime

from dateutil.relativedelta import relativedelta

from cdb_csv.pe import compute_action_date


# See https://github.com/gip-inclusion/carnet-de-bord/issues/755#issuecomment-1265523681
async def test_import_pe_referent():

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

    # pour celle qui ont un date de fin et de réalisation en plus de la date de prescription = afficher la date de réalisation (sauf UNE FORMATION DANS LE DOMAINE SUIVANT)
    event_date = compute_action_date(
        date_prescription=now,
        date_realisation_action=one_month_later,
        date_fin=two_month_later,
        label="",
    )

    assert event_date == one_month_later

    # Pour "UNE FORMATION DANS LE DOMAINE SUIVANT" si date de fin plus date de réalisation + libellé formation dans colonne "formation" = afficher la date de fin
    event_date = compute_action_date(
        date_prescription=now,
        date_realisation_action=None,
        date_fin=two_month_later,
        label="UNE FORMATION DANS LE DOMAINE SUIVANT",
    )
    assert event_date == two_month_later
