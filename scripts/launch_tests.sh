#!/usr/bin/env bash

set -eo pipefail

# Exit everything when this shell exits
trap "exit" INT TERM
trap "cleanup" EXIT

function cleanup() {
  status=$?
  >&2 echo "Cleaning up... (status=$status)"
  children=$(jobs -p)
  if [[ -n "$children" ]]; then
    kill $children ||true
  fi
  exit $status
}

if ! docker compose version >/dev/null 2>&1; then
  echo >&2 "Error: 'docker compose' is not installed."
  exit 1
fi

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
ROOT_DIR=$( dirname $SCRIPT_DIR )

ACTION=$1
RUN="all"

if [ ! -z "$ACTION" ]
then
      if [ "$ACTION" != "all" ] && [ "$ACTION" != "python" ] && [ "$ACTION" != "js" ] && [ "$ACTION" != "e2e" ]; then
        echo "Bad parameter value: '$ACTION'"
        echo ""
        echo "Usage : $0 [all|python|js]"
        exit
      fi

      # Keep the rest of the arguments for the test command
      shift
fi

# Load the env variables from app/.env file
if [ -f "app/.env.test" ]
then
  # See https://github.com/ko1nksm/shdotenv
  eval "$($SCRIPT_DIR/shdotenv --env app/.env.test)"
else

  echo >&2 "Missing app/.env.test file. Copy the one from app/.env.test.sample to app/.env.test."
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

cd hasura
HASURA_GRAPHQL_ENDPOINT=http://localhost:5001 hasura seed apply --database-name carnet_de_bord
cd $ROOT_DIR

function start_svelte() {
  >&2 echo "-> Starting Svelte kit"

  cd app
  # Start dev server
  # Need to listen on all addresses (0.0.0.0) to be reachable from Hasura in Docker on all platforms.
  # Piping through "cat" to disable annoying terminal control codes from svelte-kit that mess up the
  # output.
  yarn svelte-kit dev --host 0.0.0.0 --port 3001 | cat &
	cd ..

  until curl -s http://localhost:3001/ > /dev/null ; do
    >&2 echo "-> Svelte kit is still unavailable - sleeping"
    sleep 1
  done

  >&2 echo ""
  >&2 echo "-> Svelte kit is up and running on port 3001!"
}

function start_backend() {
  >&2 echo "-> Starting Python backend"

  cd backend
  poetry run uvicorn api.main:app --port 8001 &
  cd ..

  until curl -s http://localhost:8001/ > /dev/null ; do
    >&2 echo "-> Python backend is still unavailable - sleeping"
    sleep 1
  done

  >&2 echo ""
  >&2 echo "-> Python backend is up and running on port 8001!"
}

if [ "$ACTION" = "all" ] || [ "$ACTION" = "js" ]; then
  >&2 echo "-> Starting Jest tests"
	(cd app && npx jest "$@")
fi

if [ "$ACTION" = "all" ] || [ "$ACTION" = "python" ]; then
  >&2 echo "-> Starting Python tests"
  (cd backend && poetry run pytest "$@")
fi

if [ "$ACTION" = "e2e" ]; then
  start_svelte
  start_backend

  >&2 echo "-> Starting e2e tests"
  HASURA_BASEURL=http://localhost:5001/v1/graphql \
  HASURA_ADMIN_SECRET=$HASURA_GRAPHQL_ADMIN_SECRET \
  CODECEPT_BASEURL=http://localhost:3001 \
    yarn --cwd e2e test "$@"
fi
