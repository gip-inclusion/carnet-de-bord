#!/bin/bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
ROOT_DIR=$(dirname $SCRIPT_DIR)

MAINS=$(find $ROOT_DIR/app/elm/* -type f -name Main.elm)

RESULT=0
for MAIN in $MAINS; do
	elm make --optimize $MAIN --output=/dev/null >/dev/null
	RESULT=$((RESULT + $?))
done
if (($RESULT != 0)); then
	echo "FAILED"
fi
