from datetime import date, datetime

from pydantic import BaseModel, validator


class PrincipalCsvRow(BaseModel):
    unique_id: str
    title: str
    last_name: str
    first_name: str
    place_of_birth: str
    date_of_birth: date
    rome_1: str
    rome_1_label: str
    rome_2: str
    rome_2_label: str

    @validator("date_of_birth", pre=True)
    def parse_birthdate(cls, value):
        return datetime.strptime(value, "%Y-%m-%d %H:%M:%S.%f").date()
