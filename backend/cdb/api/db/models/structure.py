from datetime import datetime
from uuid import UUID

from luhn_validator import validate as validate_luhn
from pandas.core.series import Series
from pydantic import BaseModel, EmailStr, Field, HttpUrl, ValidationError, validator

from cdb.api.db.models.csv import CsvFieldError
from cdb.api.db.models.validator import phone_validator, postal_code_validator


class BaseStructure(BaseModel):
    siret: str | None
    name: str | None
    short_desc: str | None
    phone: str | None
    postal_code: str | None
    city: str | None
    address1: str | None
    address2: str | None
    deployment_id: UUID


class StructureInsert(BaseStructure):
    email: EmailStr | None
    website: HttpUrl | None


class Structure(BaseStructure):
    id: UUID
    website: str | None
    email: str | None
    created_at: datetime
    updated_at: datetime


class StructureInputRow(BaseModel):
    name: str = Field(alias="Nom")
    short_desc: str | None = Field(alias="Description")
    phone: str | None = Field(alias="Téléphones")
    address1: str | None = Field(alias="Adresse")
    address2: str | None = Field(alias="Adresse (complément)")
    postal_code: str = Field(alias="Code postal")
    city: str = Field(alias="Ville")
    website: HttpUrl | None = Field(alias="Site web")
    email: EmailStr | None = Field(alias="Courriel")
    siret: str | None = Field(alias="Siret")
    admin_email: EmailStr = Field(alias="Courriel responsable")
    admin_firstname: str | None = Field(alias="Prénom responsable")
    admin_lastname: str | None = Field(alias="Nom responsable")
    admin_phone_number: str | None = Field(alias="Téléphones responsable")
    admin_position: str | None = Field(alias="Fonction responsable")

    class Config:
        anystr_strip_whitespace = True
        allow_population_by_field_name = True

    @validator("siret", allow_reuse=True)
    def must_be_a_valid_siret(cls, value: str) -> str:
        if value and not validate_luhn(value):
            raise ValueError("value is not a valid siret")
        return value

    _postal_code_validator = postal_code_validator("postal_code")

    _phone_validator = phone_validator("phone", "admin_phone_number", pre=True)


class StructureCsvRowResponse(BaseModel):
    row: dict | None = None
    data: StructureInputRow | None = None
    valid: bool
    errors: list[CsvFieldError] | None = None


def map_csv_row(row: Series) -> StructureCsvRowResponse:
    try:
        data = StructureInputRow.parse_obj(row)
        return StructureCsvRowResponse(data=data, valid=True)

    except ValidationError as error:
        return StructureCsvRowResponse(
            row=row.to_dict(),
            valid=False,
            errors=[
                CsvFieldError(key="".join(str(err["loc"][0])), error=err["msg"])
                for err in error.errors()
            ],
        )


def map_input_row_to_structure_insert(
    structure: StructureInputRow, deployment_id: UUID
) -> StructureInsert:
    return StructureInsert(
        siret=structure.siret,
        name=structure.name,
        short_desc=structure.short_desc,
        phone=structure.phone,
        email=structure.email,
        postal_code=structure.postal_code,
        city=structure.city,
        address1=structure.address1,
        address2=structure.address2,
        website=structure.website,
        deployment_id=deployment_id,
    )
