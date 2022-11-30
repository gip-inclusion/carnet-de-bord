from datetime import datetime
from urllib import parse
from uuid import UUID

from dateutil.relativedelta import relativedelta

from api.core.jinja import jinja_env
from api.core.sendmail import send_mail
from api.core.settings import settings
from api.db.models.orientation_type import OrientationType


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


def orientation_notebook_member_email(
    beneficiary_firstname: str,
    beneficiary_lastname: str,
    new_referent_structure: str,
    old_referent_firstname: str,
    old_referent_lastname: str,
    old_referent_structure: str,
    orientation_type: OrientationType,
    template_path: str,
    orientation_date: datetime | None,  # Can be none if there is no orientation request
    new_referent_firstname: str | None,
    new_referent_lastname: str | None,
    is_orientation_request: bool = False,
) -> str:
    template = jinja_env.get_template(template_path)

    if orientation_date is not None:
        date_format = "%d/%m/%Y"
        formatted_request_date = orientation_date.strftime(date_format)

        formatted_access_date = (orientation_date + relativedelta(months=+1)).strftime(
            date_format
        )
    else:
        formatted_access_date = ""
        formatted_request_date = ""

    return template.render(
        beneficiary_firstname=beneficiary_firstname,
        beneficiary_lastname=beneficiary_lastname,
        old_referent_firstname=old_referent_firstname,
        old_referent_lastname=old_referent_lastname,
        old_referent_structure=old_referent_structure,
        new_referent_firstname=new_referent_firstname,
        new_referent_lastname=new_referent_lastname,
        new_referent_structure=new_referent_structure,
        url=settings.app_url,
        is_orientation_request=is_orientation_request,
        orientation_type=orientation_type,
        formatted_access_date=formatted_access_date,
        formatted_request_date=formatted_request_date,
    )


def send_orientation_referent_email(
    email: str,
    subject: str,
    beneficiary_firstname: str,
    beneficiary_lastname: str,
    new_referent_structure: str,
    old_referent_firstname: str,
    old_referent_lastname: str,
    old_referent_structure: str,
    orientation_type: OrientationType,
    template_path: str,
    orientation_date: datetime | None,  # Can be none if there is no orientation request
    new_referent_firstname: str | None,
    new_referent_lastname: str | None,
    is_orientation_request: bool = False,
) -> None:
    message = orientation_notebook_member_email(
        beneficiary_firstname=beneficiary_firstname,
        beneficiary_lastname=beneficiary_lastname,
        old_referent_firstname=old_referent_firstname,
        old_referent_lastname=old_referent_lastname,
        old_referent_structure=old_referent_structure,
        new_referent_firstname=new_referent_firstname,
        new_referent_lastname=new_referent_lastname,
        new_referent_structure=new_referent_structure,
        is_orientation_request=is_orientation_request,
        orientation_type=orientation_type,
        orientation_date=orientation_date,
        template_path=template_path,
    )
    send_mail(to=email, subject=subject, message=message)
