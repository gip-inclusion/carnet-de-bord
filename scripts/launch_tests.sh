#!/usr/bin/env bash

set -eo pipefail

# Exit everything when this shell exits
trap "exit" INT TERM
trap "kill 0" EXIT

if ! [ -x "$(command -v docker compose)" ]; then
  echo >&2 "Error: `docker compose` is not installed."
  exit 1
fi

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
ROOT_DIR=$( dirname $SCRIPT_DIR )

ACTION=$1
RUN="all"

if [ ! -z "$ACTION" ]
then
      if [ "$ACTION" != "all" ] && [ "$ACTION" != "python" ] && [ "$ACTION" != "js" ]; then
        echo "Bad parameter value: '$ACTION'"
        echo ""
        echo "Usage : $0 [all|python|js]"
        exit
      fi
fi

# Load the env variables from .env file
if [ -f ".env.test" ]
then
  # See https://github.com/ko1nksm/shdotenv
  eval "$($SCRIPT_DIR/shdotenv --env .env.test)"
else

  echo >&2 "Missing .env.test file. Copy the one from .env.test.sample to .env.test."
  exit 1
fi

CONTAINERS=( db_test hasura_test )

# Clean existing containers
for CONTAINER_NAME in "${CONTAINERS[@]}"
do
  if [ ! "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
      CONTAINER=$(docker ps -aq -f status=exited -f name=$CONTAINER_NAME)
      if [ "$CONTAINER" ]; then
          echo "-> Cleaning already existing container $CONTAINER_NAME - $CONTAINER";
          docker rm $CONTAINER
      fi
  fi
done

if [ ! "$(docker ps -q -f name=db_test)" ] && [ ! "$(docker ps -q -f name=hasura_test)" ]; then

    # Clean existing volume
    if [ "$(docker volume ls | grep cdb-pgdata-test)" ]; then
        echo "-> Clean existing volume carnet-de-bord_cdb-pgdata-test"
        docker volume rm carnet-de-bord_cdb-pgdata-test
    fi
    echo "-> Starting docker"
    docker compose -f docker-compose-test.yaml up --build -d
else
    echo "Docker test env already started. Use: "
    echo ""
    echo "    docker compose -f docker-compose-test.yaml stop"
    echo ""
    echo "in $ROOT_DIR if you want to stop it."
    echo ""
fi

# Wait for Hasura
# Keep pinging Hasura until it's ready to accept commands
until curl -s http://localhost:5001/healthz > /dev/null ; do
  >&2 echo "-> Hasura is still unavailable - sleeping"
  sleep 1
done

>&2 echo ""
>&2 echo "-> Hasura is up and running on port 5001!"

HASURA_GRAPHQL_ENDPOINT=http://localhost:5001 yarn hasura:seed
cd $ROOT_DIR


if [ "$ACTION" = "all" ] || [ "$ACTION" = "js" ]; then
  >&2 echo "-> Starting Svelte kit"
  # Start dev server
  npx svelte-kit dev --port 3001 &


  until curl -s http://localhost:3001/ > /dev/null ; do
    >&2 echo "-> Svelte kit is still unavailable - sleeping"
    sleep 1
  done

  >&2 echo ""
  >&2 echo "-> Svelte kit is up and running on port 3001!"

  >&2 echo "-> Starting Jest tests"
  npx jest
fi
