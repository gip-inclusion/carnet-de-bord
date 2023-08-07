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
        echo "Usage : $0 [all|e2e|python|js]"
        exit
      fi

      # Keep the rest of the arguments for the test command
      shift
fi

# Load the env variables from .env file
if [ -f "$ROOT_DIR/.env.test" ]
then
  # See https://github.com/ko1nksm/shdotenv
  eval "$($SCRIPT_DIR/shdotenv --env .env.test)"
else

  echo >&2 "Missing .env.test file. Copy the one from .env.test.sample to .env.test."
  exit 1
fi

echo "-> Starting dockerized environment (PostgreSQL + Hasura)"
docker compose -f "$ROOT_DIR/docker-compose-test.yaml" up --build --detach --wait

docker compose -f "$ROOT_DIR/docker-compose-test.yaml" exec \
  -e HASURA_GRAPHQL_ENDPOINT=http://localhost:8080 \
  hasura_test \
  hasura-cli seed apply --all-databases

function start_svelte() {
  >&2 echo "-> Starting Svelte kit"

  # Start dev server
  # Need to listen on all addresses (0.0.0.0) to be reachable from Hasura in Docker on all platforms.
  # Piping through "cat" to disable annoying terminal control codes from svelte-kit that mess up the
  # output.
  # npm run dev --prefix app -- --port 3001 &
  cd app
  npm run build
  HOST= PORT=3001 ORIGIN=http://localhost:3001 node build &
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
  poetry run uvicorn cdb.api.main:app --host '' --port 8001 &
  cd ..

  until curl -s http://localhost:8001/ > /dev/null ; do
    >&2 echo "-> Python backend is still unavailable - sleeping"
    sleep 1
  done

  >&2 echo ""
  >&2 echo "-> Python backend is up and running on port 8001!"
}
if [ "$ACTION" = "all" ] || [ "$ACTION" = "js" ] || [ "$ACTION" = "e2e" ]; then
	start_backend
fi

if [ "$ACTION" = "all" ] || [ "$ACTION" = "js" ]; then
  >&2 echo "-> Starting js tests"
	npm --prefix app test "$@"
fi

if [ "$ACTION" = "all" ] || [ "$ACTION" = "python" ]; then
  >&2 echo "-> Starting Python tests"
  (cd backend && poetry run pytest "$@")
fi

if [ "$ACTION" = "all" ] || [ "$ACTION" = "e2e" ]; then
  start_svelte

  >&2 echo "-> Starting e2e tests"
  HASURA_BASEURL=http://localhost:5001 \
  CODECEPT_BASEURL=http://localhost:3001 \
    npm --prefix e2e run test -- "$@"
fi
