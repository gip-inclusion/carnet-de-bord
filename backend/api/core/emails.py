from urllib import parse
from uuid import UUID

from api.core.jinja import jinja_env
from api.core.settings import settings


def create_magic_link(access_key: UUID, redirect_path: str | None = None) -> str:
    magic_link = f"{settings.app_url}/auth/jwt/{access_key}"
    if redirect_path is not None:
        magic_link += f"?url={parse.quote(redirect_path)}"

    return magic_link


def orientation_manager_account_creation_email(
    username: str, firstname: str | None, lastname: str | None, access_key: str
) -> str:
    template = jinja_env.get_template("orientation_manager_email.html")
    return template.render(
        firstname=firstname,
        lastname=lastname,
        url=create_magic_link(access_key=access_key),
        username=username,
    )
