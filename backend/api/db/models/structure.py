import logging
import re
from datetime import datetime
from uuid import UUID
from xmlrpc.client import boolean

from luhn_validator import validate as validate_luhn
from pandas.core.series import Series
from pydantic import BaseModel, EmailStr, Field, HttpUrl, ValidationError, validator

from api.core.settings import settings

logging.basicConfig(level=logging.INFO, format=settings.LOG_FORMAT)


class StructureInsert(BaseModel):
    siret: str | None
    name: str | None
    short_desc: str | None
    phone: str | None
    email: EmailStr | None
    postal_code: str | None
    city: str | None
    address1: str | None
    address2: str | None
    website: str | None
    deployment_id: UUID | None


class Structure(StructureInsert):
    id: UUID
    created_at: datetime
    updated_at: datetime


class StructureInputRow(BaseModel):
    name: str = Field(alias="Nom*")
    short_desc: str | None = Field(alias="Description")
    phone: str | None = Field(alias="Téléphones")
    address1: str | None = Field(alias="Adresse")
    address2: str | None = Field(alias="Adresse (complément)")
    postal_code: str = Field(alias="Code postal*")
    city: str = Field(alias="Ville*")
    website: HttpUrl | None = Field(alias="Site web")
    email: EmailStr | None = Field(alias="Courriel")
    siret: str | None = Field(alias="Siret")
    admin_email: EmailStr = Field(alias="Courriel responsable*")
    admin_firstname: str | None = Field(alias="Prénom responsable")
    admin_lastname: str | None = Field(alias="Nom responsable")
    admin_phone_number: str | None = Field(alias="Téléphones responsable")
    admin_position: str | None = Field(alias="Fonction responsable")

    class Config:
        anystr_strip_whitespace = True

    @validator("siret", allow_reuse=True)
    def must_be_a_valid_siret(cls, value: str) -> str:
        if not value:
            return value
        if not validate_luhn(value):
            raise ValueError(f"{value} not a valid siret")
        return value

    @validator("postal_code", allow_reuse=True)
    def must_be_a_valid_postal_code(cls, value: str) -> str:
        if not value:
            return value
        if value[0:2] == "00":
            raise ValueError(f"{value} not a valid postal code")
        if not re.match("^[0-9]{5}$", value):
            raise ValueError(f"{value} not a valid postal code")
        return value

    @validator("phone", allow_reuse=True)
    def must_be_a_valid_phone(cls, value: str) -> str:
        if not value:
            return value

        phones = value.split(",")
        for phone in phones:
            if not re.match(r"^((\+|00)33|0)\s?[1-9]([\s.-]*\d{2}){4}$", phone.strip()):
                raise ValueError("not a valid phone number")
        return ", ".join([phone.strip() for phone in phones])


class CsvFieldError(BaseModel):
    key: str | None = None
    error: str


class StructureCsvRowResponse(BaseModel):
    row: dict | None = None
    data: StructureInputRow | None = None
    valid: boolean
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

    except Exception as error:
        return StructureCsvRowResponse(
            row=row.to_dict(),
            valid=True,
            errors=[CsvFieldError(error=str(error))],
        )
