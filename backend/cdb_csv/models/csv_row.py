import hashlib
from datetime import date, datetime

from pydantic import BaseModel, Field, validator


class PrincipalCsvRow(BaseModel):
    identifiant_unique_de: str
    civilite: str
    nom: str
    prenom: str
    lieu_naissance: str
    code_lieu_naissance: str
    date_naissance: date
    adresse_ligne2: str
    adresse_ligne3: str
    adresse_ligne4: str
    adresse_ligne5: str
    adresse_ligne6: str
    departement: str
    # code d'identification de la direction régionale
    dr: str
    rome_1: str
    appelation_rome_1: str
    rome_2: str
    appelation_rome_2: str
    # @TODO: find meaning?
    # mrech.axetravailprincipal
    mrech_axetravailprincipal: str = Field(None, alias="mrech.axetravailprincipal")
    # @TODO: find meaning?
    # mrech.axetravailsecondaire
    mrech_axetravailsecondaire: str = Field(None, alias="mrech.axetravailsecondaire")

    der_entretien_ppae: date | None
    der_entretien: date | None
    inscription: date | None
    code_motif_inscription: str
    motif_inscription: str
    categorie_inscription: str
    struct_principale: str
    referent_civilite: str
    referent_nom: str
    referent_prenom: str
    referent_mail: str
    modalite_accompagnement: str
    struct_suivi: str
    suivi_debut: date | None
    suivi_fin_prev: date | None
    dif_financiere: bool
    dif_admin_jur: bool
    dif_sante: bool
    dif_logement: bool
    dif_transport: bool
    dif_inser_com: bool
    dif_familiale: bool
    brsa: bool

    @validator(
        "dif_financiere",
        "dif_admin_jur",
        "dif_sante",
        "dif_logement",
        "dif_transport",
        "dif_inser_com",
        "dif_familiale",
        "brsa",
        pre=True,
        allow_reuse=True,
    )
    def parse_bool(cls, value):
        if value == "OUI" or value == "O":
            return True
        else:
            return False

    @validator(
        "date_naissance",
        "der_entretien_ppae",
        "der_entretien",
        "inscription",
        "suivi_debut",
        "suivi_fin_prev",
        pre=True,
    )
    def parse_date(cls, value):
        if value != "NULL":
            return datetime.strptime(value, "%Y-%m-%d %H:%M:%S.%f").date()


async def get_sha256(csv_row: PrincipalCsvRow) -> str:
    return hashlib.sha256(str(csv_row.dict()).encode()).hexdigest()
