from datetime import datetime
from typing import Any
from urllib import parse
from uuid import UUID

from pydantic import BaseModel

from api.core.jinja import jinja_env
from api.core.sendmail import send_mail
from api.core.settings import settings
from api.db.models.orientation_type import OrientationType


class Person(BaseModel):
    firstname: str
    lastname: str

    def get_name(self):
        return f"{self.firstname} {self.lastname}"

    @classmethod
    def parse_from_gql(cls, data: dict[str, str]):
        return Person(firstname=data["firstname"], lastname=data["lastname"])


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


def create_magic_link(access_key: UUID, redirect_path: str | None = None) -> str:
    magic_link = f"{settings.app_url}/auth/jwt/{access_key}"
    if redirect_path is not None:
        magic_link += f"?url={parse.quote(redirect_path)}"

    return magic_link


def generic_account_creation_email(
    username: str, firstname: str | None, lastname: str | None, access_key: UUID
) -> str:
    template = jinja_env.get_template("generic_account_creation_email.html")
    return template.render(
        firstname=firstname,
        lastname=lastname,
        url=create_magic_link(access_key=access_key),
        username=username,
    )


def send_invitation_email(
    email: str, firstname: str | None, lastname: str | None, access_key: UUID
) -> None:
    message = generic_account_creation_email(email, firstname, lastname, access_key)
    send_mail(
        to=email, subject="Création de compte sur Carnet de bord", message=message
    )


def send_notebook_member_email(
    to_email: str,
    beneficiary: Person,
    orientation: OrientationType,
    former_referents: list[Member],
    new_referent: Member | None,
    new_structure: str,
):
    template = jinja_env.get_template("notebook_member_email.html")
    subject = "Orientation d'un bénéficiaire"
    if len(former_referents) > 0:
        subject = "Réorientation d'un bénéficiaire"

    message = template.render(
        beneficiary=beneficiary,
        orientation=orientation,
        former_referents=former_referents,
        new_referent=new_referent,
        new_structure=new_structure,
        url=settings.app_url,
    )
    send_mail(to=to_email, subject=subject, message=message)
