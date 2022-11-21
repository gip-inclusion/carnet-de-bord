from datetime import date, datetime
from uuid import UUID

from pandas.core.series import Series
from pydantic import BaseModel, EmailStr, Field, ValidationError, validator

from api.db.models.csv import CsvFieldError
from api.db.models.nir import nir_format
from api.db.models.notebook import Notebook
from api.db.models.validator import (
    date_validator,
    is_bool_validator,
    phone_validator,
    postal_code_validator,
)


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
    pe_unique_import_id: str | None


def snake_to_camel(field):
    parts = field.split("_")
    return "".join(parts[0:1] + [part.title() for part in parts[1:]])


def is_same_name(firstname1, firstname2, lastname1, lastname2):
    return (
        firstname1.lower().strip() == firstname2.lower().strip()
        and lastname1.lower().strip() == lastname2.lower().strip()
    )


class BeneficiaryImport(BaseModel):
    internal_id: str = Field(..., alias="Identifiant dans le SI*")
    firstname: str = Field(..., alias="Prénom*")
    lastname: str = Field(..., alias="Nom*")
    date_of_birth: date = Field(..., alias="Date de naissance*")
    place_of_birth: str | None = Field(None, alias="Lieu de naissance")
    mobile_number: str | None = Field(None, alias="Téléphone")
    email: EmailStr | None = Field(None, alias="Email")
    address1: str | None = Field(None, alias="Adresse")
    address2: str | None = Field(None, alias="Adresse (complément)")
    postal_code: str | None = Field(None, alias="Code postal")
    city: str | None = Field(None, alias="Ville")
    work_situation: str | None = Field(None, alias="Situation")
    caf_number: str | None = Field(None, alias="Numéro allocataire CAF/MSA")
    pe_number: str | None = Field(None, alias="Identifiant Pôle emploi")
    right_rsa: str | None = Field(None, alias="Droits RSA")
    right_are: bool | None = Field(None, alias="Droits ARE")
    right_ass: bool | None = Field(None, alias="Droits ASS")
    right_bonus: bool | None = Field(None, alias="Prime d'activité")
    right_rqth: bool | None = Field(None, alias="Droits RQTH")
    geographical_area: str | None = Field(None, alias="Zone de mobilité")
    rome_code_description: str | None = Field(
        None, alias="Emploi recherché (code ROME)"
    )
    education_level: str | None = Field(None, alias="Niveau de formation")
    structure_name: str | None = Field(None, alias="Structure")
    advisor_email: EmailStr | None = Field(None, alias="Accompagnateurs")
    nir: str | None = Field(None, alias="NIR")

    class Config:
        anystr_strip_whitespace = True
        allow_population_by_field_name = True

    _phone_validator = phone_validator("mobile_number")
    _postal_code_validator = postal_code_validator("postal_code")
    _is_bool_validator = is_bool_validator(
        "right_are", "right_ass", "right_bonus", "right_rqth", pre=True
    )
    _date_validator = date_validator("date_of_birth", pre=True)

    @validator("right_rsa")
    def parse_right_rsa(cls, right_rsa):
        if right_rsa and right_rsa not in [
            "rsa_droit_ouvert_et_suspendu",
            "rsa_droit_ouvert_versable",
            "rsa_droit_ouvert_versement_suspendu",
        ]:
            raise ValueError("value unknown")
        return right_rsa

    @validator("geographical_area")
    def parse_geographical_area(cls, geographical_area):
        if geographical_area and geographical_area not in [
            "none",
            "less_10",
            "between_10_20",
            "between_20_30",
            "plus_30",
        ]:
            raise ValueError("value unknown")
        return geographical_area

    @validator("work_situation")
    def parse_work_situation(cls, work_situation):
        if work_situation and work_situation not in [
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
            raise ValueError("value unknown")
        return work_situation

    @validator("education_level")
    def parse_education_level(cls, education_level):
        if education_level and education_level not in [
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
            raise ValueError("value unknown")
        return education_level

    @validator("nir")
    def parse_nir(cls, nir: str):
        validation_error = nir_format(nir)
        if validation_error:
            raise ValueError(validation_error)
        return nir


class BeneficiaryCsvRowResponse(BaseModel):
    row: dict | None = None
    data: BeneficiaryImport | None = None
    valid: bool
    update: bool = False
    errors: list[CsvFieldError] | None = None


def map_csv_row(row: Series) -> BeneficiaryCsvRowResponse:
    try:
        data = BeneficiaryImport.parse_obj(row)
        return BeneficiaryCsvRowResponse(data=data, valid=True)

    except ValidationError as error:
        return BeneficiaryCsvRowResponse(
            row=row.to_dict(),
            valid=False,
            errors=[
                CsvFieldError(key="".join(str(err["loc"][0])), error=err["msg"])
                for err in error.errors()
            ],
        )
