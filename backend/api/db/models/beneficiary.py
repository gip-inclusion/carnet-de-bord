from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, Field, validator

from api.db.models.notebook import Notebook


class BeneficiaryStructure(BaseModel):
    structure_id: UUID
    structure_name: str
    beneficiary_status: str


class Beneficiary(BaseModel):
    id: UUID
    email: str | None
    lastname: str
    firstname: str
    caf_number: str | None
    pe_number: str | None
    postal_code: str | None
    city: str | None
    address1: str | None
    address2: str | None
    mobile_number: str | None
    date_of_birth: date
    place_of_birth: str | None
    deployment_id: UUID
    created_at: datetime
    updated_at: datetime
    internal_id: str | None
    notebook: Notebook | None
    # BRSA users may not have an account
    # (account is created on the first login attempt)
    account_id: UUID | None
    nir: str | None


def snake_to_camel(field):
    parts = field.split("_")
    return "".join(parts[0:1] + [part.title() for part in parts[1:]])


class BeneficiaryImport(BaseModel):
    si_id: str = Field(..., title="Identifiant du SI interne")
    firstname: str = Field(..., title="Prénom")
    lastname: str = Field(..., title="Nom")
    date_of_birth: date = Field(..., title="Date de naissance")
    place_of_birth: str | None = Field(None, title="Lieu de naissance")
    phone_number: str | None = Field(None, title="Numéro de téléphone")
    email: str | None = Field(None, title="Email")
    address1: str | None = Field(None, title="Adresse")
    address2: str | None = Field(None, title="Complément d'adresse")
    postal_code: str | None = Field(None, title="Code postal")
    city: str | None = Field(None, title="Ville")
    work_situation: str | None = Field(None, title="Situation professionnelle")
    caf_number: str | None = Field(None, title="Numéro CAF/MSA")
    pe_number: str | None = Field(None, title="Identifiant Pole Emploi")
    right_rsa: str | None = Field(None, title="Droits RSA")
    right_are: bool | None = Field(None, title="Droits ARE")
    right_ass: bool | None = Field(None, title="Droits ASS")
    right_bonus: bool | None = Field(None, title="Droits Bonus")
    right_rqth: bool | None = Field(None, title="Droits RQTH")
    geographical_area: str | None = Field(None, title="Zone de mobilité")
    rome_code_description: str | None = Field(None, title="Emploi recherché")
    education_level: str | None = Field(None, title="Niveau de formation")
    structure_name: str | None = Field(None, title="Structure d'accompagnement")
    advisor_email: str | None = Field(None, title="Accompagnateur référent")

    class Config:
        alias_generator = snake_to_camel
        allow_population_by_field_name = True

    @validator("firstname", "lastname")
    def capitalize(cls, value):
        return value.lower().strip()

    @validator("right_are", "right_ass", "right_bonus", "right_rqth", pre=True)
    def parse_bool(cls, value):
        if type(value) == str:
            if value.lower().strip() in ["oui", "o"]:
                return True
            else:
                return False
        elif type(value) == bool:
            return value
        else:
            return False

    @validator("right_rsa")
    def parse_right_rsa(cls, right_rsa):
        if right_rsa and right_rsa.strip() in [
            "rsa_droit_ouvert_et_suspendu",
            "rsa_droit_ouvert_versable",
            "rsa_droit_ouvert_versement_suspendu",
        ]:
            return right_rsa.strip()
        else:
            return None

    @validator("geographical_area")
    def parse_geographical_area(cls, geographical_area):
        if geographical_area and geographical_area.strip() in [
            "none",
            "less_10",
            "between_10_20",
            "between_20_30",
            "plus_30",
        ]:
            return geographical_area.strip()
        else:
            return None

    @validator("work_situation")
    def parse_work_situation(cls, work_situation):
        if work_situation and work_situation.strip() in [
            "recherche_emploi",
            "recherche_formation",
            "recherche_alternance",
            "recherche_stage",
            "emploi",
            "formation",
            "stage",
            "alternance",
            "service_civique",
            "iae",
            "interim",
            "construction_projet",
            "projet_entrepreneurial",
            "entrepreneur",
            "etudiant",
            "scolarisé",
            "enretraite",
            "maladie",
            "invalidite",
            "conge_parental",
            "au_foyer",
            "autre",
            "cdi_temps_plein",
            "cdi_temps_partiel",
            "cdd_temps_plein",
            "cdd_temps_partiel",
            "intermittent",
        ]:
            return work_situation.strip()
        else:
            return None

    @validator("education_level")
    def parse_education_level(cls, education_level):
        if education_level and education_level.strip() in [
            "AFS",
            "C12",
            "C3A",
            "CFG",
            "CP4",
            "NV5",
            "NV4",
            "NV3",
            "NV2",
            "NV1",
        ]:
            return education_level.strip()
        else:
            return None
