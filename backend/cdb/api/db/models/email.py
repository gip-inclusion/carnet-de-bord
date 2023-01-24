from datetime import date
from typing import Any

from pydantic import BaseModel


class Person(BaseModel):
    firstname: str
    lastname: str

    def get_name(self):
        return f"{self.firstname} {self.lastname}"

    @classmethod
    def parse_from_gql(cls, data: dict[str, str]):
        return Person(firstname=data["firstname"], lastname=data["lastname"])


class PersonWithDateOfBirth(Person):
    date_of_birth: date | None
    orientation: str | None

    def get_date_of_birth(self) -> str:
        return (
            self.date_of_birth.strftime("%d/%m/%Y")
            if self.date_of_birth is not None
            else "-"
        )

    def get_orientation(self) -> str:
        return self.orientation if self.orientation is not None else "-"


class StructureWithBeneficiaries(BaseModel):
    name: str
    beneficiaries: list[PersonWithDateOfBirth]


class Member(Person):
    email: str
    structure: str | None

    def get_name_and_structure(self):
        if self.structure:
            return f"{self.firstname} {self.lastname} ({self.structure})"
        else:
            return self.get_name()

    @classmethod
    def parse_from_gql(cls, person: dict[str, Any]):
        return Member(
            firstname=person["firstname"],
            lastname=person["lastname"],
            email=person["email"],
            structure=person["structure"]["name"] if person["structure"] else None,
        )
