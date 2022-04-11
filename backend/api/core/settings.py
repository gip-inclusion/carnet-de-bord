import os

from pydantic import BaseSettings

dir_path = os.path.dirname(os.path.realpath(__file__))


class Settings(BaseSettings):

    hasura_graphql_database_url: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# By default, load the file of the parent project
env_path = os.path.join(dir_path, "..", "..", "..", ".env")

# If you want to specify a specific env file, you can setup
# the ENV_FILE variable value
#
# Something like that: ENV_FILE="../.env" python scripts/connect_to_db.py
settings = Settings(
    _env_file=os.getenv("ENV_FILE", env_path), _env_file_encoding="utf-8"
)
