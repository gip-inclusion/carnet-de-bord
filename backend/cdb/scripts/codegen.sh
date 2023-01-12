#!/usr/bin/env bash

set -euo pipefail

# Absolute path to this script
SCRIPT=`readlink -f $0`
# Absolute path this script is in
SCRIPTPATH=`dirname $SCRIPT`
pyfile=$SCRIPTPATH/../api/_gen/schema_gql.py


cat > $pyfile <<EOF
from graphql import build_schema

schema = build_schema(
    '''
$(poetry run gql-cli http://localhost:5000/v1/graphql --print-schema -H 'x-hasura-admin-secret:admin')
    '''
)
EOF
