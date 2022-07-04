from datetime import date

from cdb_csv import pe
from cdb_csv.models.csv_row import PrincipalCsvRow


async def test_csv_row(pe_principal_csv_series):

    # Get the first row
    _, series = next(pe_principal_csv_series.iterrows())
    res: PrincipalCsvRow = await pe.map_principal_row(series)
    assert res.civilite == "MME"
    assert res.nom == "TIFOUR"
    assert res.prenom == "SOPHIE"
    assert res.lieu_naissance == "LIEU NAISSANCE 1"
    assert res.code_lieu_naissance == "12345"
    assert res.date_naissance == date(1982, 2, 1)
    assert res.adresse_ligne2 == "ADRESSE_LIGNE2 1"
    assert res.adresse_ligne3 == "ADRESSE_LIGNE3 1"
    assert res.adresse_ligne4 == "ADRESSE_LIGNE4 1"
    assert res.adresse_ligne5 == "NULL"
    assert res.adresse_ligne6 == "08300 RETHEL"
    assert res.departement == "08"
    assert res.dr == "051"
    assert res.rome_1 == "A1101"
    assert (
        res.appelation_rome_1
        == "Conducteur / Conductrice d'engins d'exploitation agricole"
    )
    assert res.rome_2 == "K2204"
    assert res.appelation_rome_2 == "Agent / Agente de nettoyage en collectivité"
    assert res.mrech_axetravailprincipal == "ADAPT MARCHE TRAVAIL"
    assert res.mrech_axetravailsecondaire == "NULL"
    assert res.der_entretien_ppae == date(2020, 2, 13)
    assert res.der_entretien == date(2021, 8, 9)
    assert res.inscription == date(2019, 10, 17)
    assert res.code_motif_inscription == "14"
    assert res.motif_inscription == "FIN DE CDD OU DE CONTRAT AIDE"
    assert res.categorie_inscription == "1"
    assert res.struct_principale == "RETHEL"
    assert res.referent_civilite == "Mme"
    assert res.referent_nom == "REFERENT_NOM 1"
    assert res.referent_prenom == "Referent_prenom 1"
    assert res.referent_mail == "sanka@groupe-ns.fr"
    assert res.modalite_accompagnement == "GUIDE"
    assert res.struct_suivi == "RETHEL"
    assert res.suivi_debut == date(2017, 5, 22)
    assert res.suivi_fin_prev == date(2020, 5, 22)
    assert not res.dif_financiere
    assert not res.dif_admin_jur
    assert not res.dif_sante
    assert not res.dif_logement
    assert not res.dif_transport
    assert not res.dif_inser_com
    assert not res.dif_familiale
