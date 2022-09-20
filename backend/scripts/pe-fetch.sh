#!/usr/bin/env bash

set -euo pipefail

# Exit everything when this shell exits
trap "exit" INT TERM
trap "kill 0" EXIT

echo "dump private keys to files."

echo -e "$PE_SERVER_KEY" > pe_server.pem
echo -e "$PE_FILE_KEY" > pe_file.pem
chmod 600 *.pem

echo "download files."
sftp -o "StrictHostKeyChecking accept-new"  -i ./pe_server.pem $PE_SERVER_URL:/OI33SPIE/principal .

# Processing of the "actions" file is disabled for now because it is too large to be decrypted
# by "openssl smime". See https://marc.info/?l=openssl-users&m=138545785012939

# sftp -i ./pe_server.pem $PE_SERVER_URL:/OI33SPIE/actions .

openssl smime -decrypt -in principal -binary -inform DEM -inkey pe_file.pem -out principal.csv
# openssl smime -decrypt -in actions -binary -inform DEM -inkey pe_file.pem -out actions.csv

echo "fichier principal: $(wc -l principal.csv) lignes"
# echo "fichier actions: $(wc -l actions.csv) lignes"

cp principal.csv /mnt/pefiles
# cp actions.csv /mnt/pefiles
