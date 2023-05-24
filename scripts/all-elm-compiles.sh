#!/bin/bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
ROOT_DIR=$(dirname $SCRIPT_DIR)
cd $ROOT_DIR/app
MAINS=$(find ./elm/* -type f -name Main.elm)

RESULT=0
for MAIN in $MAINS; do
	elm make --optimize $MAIN --output=/dev/null >/dev/null
	RESULT=$((RESULT + $?))
done
if (($RESULT != 0)); then
	echo "FAILED"
else
	echo "All elm compiles"
fi
