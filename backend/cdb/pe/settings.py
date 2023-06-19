import os

from pydantic import BaseSettings

dir_path = os.path.dirname(os.path.realpath(__file__))


class Settings(BaseSettings):
    pe_agencies_url: str = "https://api.emploi-store.fr/partenaire/referentielagences"
    pe_access_token_api_url: str = (
        "https://entreprise.pole-emploi.fr/connexion/oauth2/access_token"
    )

    pe_client_id: str
    pe_client_secret: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# By default, load the file of the parent project if the ENV_FILE
# variable doesn't exist
#
# If you want to specify a specific env file, you can setup
# the ENV_FILE variable value
#
# Something like that: ENV_FILE="../.env" python scripts/connect_to_db.py

env_file_path = os.getenv("ENV_FILE", os.path.join(dir_path, "..", "..", "..", ".env"))


if os.path.exists(env_file_path):
    settings = Settings(_env_file=env_file_path, _env_file_encoding="utf-8")
else:
    settings = Settings()
