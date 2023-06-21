#!/usr/bin/env bash

GREEN='\033[0;32m'
NC='\033[0m'

# Find the root dir of the app based on the script path
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
ROOT_DIR=$(dirname $SCRIPT_DIR)

STEP_FILE_CONTENT=$(cat $ROOT_DIR/e2e/step_definitions/steps.js)
UNSORTED_VOCABULARY=$(echo "$STEP_FILE_CONTENT" | sed -nr "s/^(\w+)\(\s*[\"'](.+)[\"'],.*/\1 \2/p")
VOCABULARY_COUNT=$(echo "$UNSORTED_VOCABULARY" | wc -l  | xargs)
VOCABULARY=$(echo "$UNSORTED_VOCABULARY" | sort -r)

VOCABULARY_PATH="${ROOT_DIR}/e2e/vocabulaire.feature"
echo "# Ce fichier a été généré avec 'make e2e-update-vocabulary'" > $VOCABULARY_PATH
echo "# Ne pas éditer" >> $VOCABULARY_PATH
echo "$VOCABULARY" >> $VOCABULARY_PATH
echo "Extracted $VOCABULARY_COUNT lines of vocabulary into ${VOCABULARY_PATH}"
echo -e "${GREEN}--DONE--${NC}"
