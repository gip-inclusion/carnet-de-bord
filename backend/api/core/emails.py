from urllib import parse
from uuid import UUID

from api.core.jinja import jinja_env
from api.core.sendmail import send_mail
from api.core.settings import settings


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


def send_former_referent_email(email: str) -> None:
    send_mail(to=email, subject="Fin de mandat", message="message")


def send_new_referent_email(email: str) -> None:
    send_mail(to=email, subject="Mandat d'orientation", message="message")
