#!/usr/bin/env bash

set -eo pipefail

# Exit everything when this shell exits
trap "exit" INT TERM
trap "kill 0" EXIT

echo "PE FETCH AND PARSE env:$hello"
