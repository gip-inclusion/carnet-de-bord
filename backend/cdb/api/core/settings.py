import os

from pydantic import BaseSettings, validator

dir_path = os.path.dirname(os.path.realpath(__file__))


class Settings(BaseSettings):
    app_url: str
    database_url: str
    hasura_graphql_jwt_secret: str
    hasura_graphql_admin_secret: str
    graphql_api_url: str
    smtp_host: str
    smtp_port: str
    smtp_user: str | None
    smtp_pass: str | None

    min_pool_size: int = 2
    max_pool_size: int = 20

    PE_AUTH_BASE_URL: str = "https://entreprise.pole-emploi.fr"
    PE_BASE_URL: str = "https://api.pole-emploi.io"
    # PE_AUTH_BASE_URL: str = "https://entreprise.pe-qvr.fr"
    # PE_BASE_URL: str = "https://api.peio.pe-qvr.fr"
    PE_CLIENT_ID: str
    PE_CLIENT_SECRET: str

    action_secret: str

    V1_PREFIX: str = "/v1"
    MAIL_FROM: str = "contact@carnetdebord.inclusion.beta.gouv.fr"
    LOG_FORMAT = "[%(asctime)s:%(filename)s:%(lineno)s - %(funcName)20s() ] %(message)s"
    LOG_LEVEL: str = "INFO"
    LOG_AS_JSON: bool = True
    GQL_LOG_LEVEL: str = "WARNING"

    ENABLE_PEIO_API: bool = False
    ENABLE_SYNC_CONTRAINTES: bool = False

    SENTRY_DSN: str | None
    SENTRY_ENVIRONMENT: str | None

    @validator("LOG_LEVEL")
    def uppercase(raw: str) -> str:
        return raw.upper()

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

env_file_path = os.getenv(
    "ENV_FILE", os.path.join(dir_path, "..", "..", "..", "..", ".env")
)


if os.path.exists(env_file_path):
    settings = Settings(_env_file=env_file_path, _env_file_encoding="utf-8")
else:
    settings = Settings()
