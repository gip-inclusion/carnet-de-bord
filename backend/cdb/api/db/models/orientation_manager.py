from datetime import datetime
from uuid import UUID

from pandas.core.series import Series
from pydantic import BaseModel, EmailStr


class OrientationManagerCsvRow(BaseModel):
    email: EmailStr
    firstname: str | None
    lastname: str | None
    phone_numbers: str | None


class OrientationManagerDB(OrientationManagerCsvRow):
    id: UUID
    deployment_id: UUID
    created_at: datetime
    updated_at: datetime


class OrientationManagerResponseModel(BaseModel):
    email: str | None
    firstname: str | None
    lastname: str | None
    phone_numbers: str | None
    valid: bool
    error: str | None


def map_csv_row(row: Series) -> OrientationManagerCsvRow:
    return OrientationManagerCsvRow(
        email=row["Courriel*"],
        firstname=row["Nom"],
        lastname=row["Prénom"],
        phone_numbers=row["Téléphones"],
    )


def map_row_response(
    row: Series, valid: bool, error: str | None = None
) -> OrientationManagerResponseModel:
    return OrientationManagerResponseModel(
        valid=valid,
        error=error,
        email=row["Courriel*"] if "Courriel*" in row else None,
        firstname=row["Nom"] if "Nom" in row else None,
        lastname=row["Prénom"] if "Prénom" in row else None,
        phone_numbers=row["Téléphones"] if "Téléphones" in row else None,
    )
