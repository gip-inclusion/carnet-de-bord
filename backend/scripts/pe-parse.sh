#!/usr/bin/env bash

set -eo pipefail

# Exit everything when this shell exits
trap "exit" INT TERM
trap "kill 0" EXIT

echo $PE_SERVER_KEY > pr_server.pem
echo $PE_FILE_KEY > pe_file.pem

echo "PE FETCH AND PARSE env:$hello"


sftp  -i ./pe_server.pem $PE_SERVER_URL:/OI33SPIE/principal .
sftp  -i ./pe_server.pem $PE_SERVER_URL:/OI33SPIE/actions .

openssl smime -decrypt -in principal -binary -inform DEM -inkey pe_file.pem -out principal.csv
openssl smime -decrypt -in actions -binary -inform DEM -inkey pe_file.pem -out actions.csv

echo "fichier principal: $(wc -l principal.csv) lignes"
echo "fichier actions: $(wc -l actions.csv) lignes"
