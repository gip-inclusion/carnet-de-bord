import os
from typing import Any

from pydantic import BaseSettings, validator

dir_path = os.path.dirname(os.path.realpath(__file__))
from gql import Client
from gql.transport.requests import RequestsHTTPTransport
from graphql.type import GraphQLSchema


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
    PE_BASE_URL: str = "https://api.emploi-store.fr"
    PE_SCOPE = "api_referentielagencesv1 organisationpe"
    PE_CLIENT_ID: str = "CLIENT_ID"
    PE_CLIENT_SECRET: str = "CLIENT_SECRET"

    V1_PREFIX: str = "/v1"
    MAIL_FROM: str = "support.carnet-de-bord@fabrique.social.gouv.fr"
    LOG_FORMAT = "[%(asctime)s:%(filename)s:%(lineno)s - %(funcName)20s() ] %(message)s"
    LOG_LEVEL: str = "INFO"
    LOG_AS_JSON: bool = True

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

env_file_path = os.getenv("ENV_FILE", os.path.join(dir_path, "..", "..", "..", ".env"))


class GqlSchema:
    client: Client
    schema: GraphQLSchema | None

    def __init__(self, url, secret):
        transport = RequestsHTTPTransport(
            url=url,
            headers={"x-hasura-admin-secret": secret},
        )
        self.client = Client(transport=transport, fetch_schema_from_transport=True)
        with self.client:
            self.schema = self.client.schema

    def get_schema(self) -> GraphQLSchema | None:
        #  Fetch graphql schema using a gql client
        #  so we we can reuse it when using gql.DSL
        return self.schema


if os.path.exists(env_file_path):
    settings = Settings(_env_file=env_file_path, _env_file_encoding="utf-8")
else:
    settings = Settings()


gqlSchema = GqlSchema(settings.graphql_api_url, settings.hasura_graphql_admin_secret)
