from urllib import parse
from uuid import UUID

from cdb.api.core.jinja import jinja_env
from cdb.api.core.sendmail import send_mail
from cdb.api.core.settings import settings
from cdb.api.db.models.email import Member, Person, StructureWithBeneficiaries
from cdb.api.db.models.orientation_system import OrientationSystem


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
    orientation_system: OrientationSystem | None,
    former_referents: list[Member],
    new_referent: Member | None,
    new_structure: str | None,
):
    template = jinja_env.get_template("notebook_member_email.html")
    subject = "Orientation d’un bénéficiaire"
    if len(former_referents) > 0:
        subject = "Réorientation d’un bénéficiaire"

    message = template.render(
        beneficiary=beneficiary,
        orientation=orientation_system,
        former_referents=former_referents,
        new_referent=new_referent,
        new_structure=new_structure,
        url=settings.app_url,
    )
    send_mail(to=to_email, subject=subject, message=message)


def send_deny_orientation_request_email(
    to_email: str,
    beneficiary: Person,
):
    template = jinja_env.get_template("deny_orientation_request_email.html")
    subject = "Maintien de l’accompagnement"

    message = template.render(
        beneficiary=beneficiary,
        url=settings.app_url,
    )
    send_mail(to=to_email, subject=subject, message=message)


def send_beneficiaries_without_referent_to_admin_structure_email(
    to_email: str,
    structures: list[StructureWithBeneficiaries],
) -> None:
    template = jinja_env.get_template(
        "beneficiaries_without_referent_to_admin_structure_email.html"
    )
    subject = "Nouveaux bénéficiaires sans référent"

    message = template.render(
        structures=structures,
        url=settings.app_url,
    )
    send_mail(to=to_email, subject=subject, message=message)


def notify_manager_after_cafmsa_import(
    to_email: str, date: str, count: int, count_success: int, count_error: int
) -> None:
    print("notify_manager_after_cafmsa_import")
    template = jinja_env.get_template("caf_msa_update_report.html")
    subject = f"Récapitulatif suite à l'import du fichier CAF/MSA du {date}"
    message = template.render(
        subject=subject,
        count=count,
        count_success=count_success,
        count_error=count_error,
    )
    send_mail(
        to=to_email,
        subject=subject,
        message=message,
    )
