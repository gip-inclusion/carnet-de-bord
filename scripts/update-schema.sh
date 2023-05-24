#!/usr/bin/env bash

# Find the root dir of the app based on the script path
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
ROOT_DIR=$(dirname $SCRIPT_DIR)

# Load the env variables from .env file
if [ -f "$ROOT_DIR/.env" ]; then
	# See https://github.com/ko1nksm/shdotenv
	eval "$($SCRIPT_DIR/shdotenv --env $ROOT_DIR/.env)"
else
	echo >&2 "Missing .env file. Copy the one from .env.sample to .env."
	exit 1
fi

# extract schema from hasura
cd "${ROOT_DIR}/hasura"
npx --yes graphqurl@1.0.1 \
	"$GRAPHQL_API_URL" \
	-H "X-Hasura-Admin-Secret: ${HASURA_GRAPHQL_ADMIN_SECRET}" \
	--introspect > schema.graphql
