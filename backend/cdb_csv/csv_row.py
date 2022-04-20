from datetime import date, datetime

from pydantic import BaseModel, validator


class PrincipalCsvRow(BaseModel):
    title: str
    last_name: str
    first_name: str
    place_of_birth: str
    date_of_birth: date

    @validator("date_of_birth", pre=True)
    def parse_birthdate(cls, value):
        return datetime.strptime(value, "%Y-%m-%d %H:%M:%S.%f").date()
