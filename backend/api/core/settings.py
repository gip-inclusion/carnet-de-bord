import os

from pydantic import BaseSettings

dir_path = os.path.dirname(os.path.realpath(__file__))


class Settings(BaseSettings):

    database_url: str
    hasura_graphql_jwt_secret: str
    V1_PREFIX: str = "/v1"

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
