#!/bin/bash

HASURA_VERSION=$(cat hasura/.hasura_version)
echo "--> Version from .hasura_version file is $HASURA_VERSION"

# check that version in Dockerfile is the same as in .hasura_version file
DOCKERFILE_VERSION_IS_THE_SAME=$(head -1 hasura/Dockerfile | grep -oP ${HASURA_VERSION})

if [ -z "$DOCKERFILE_VERSION_IS_THE_SAME" ]
then
	echo "--> Error: Version in hasura/Dockerfile mismatches specified version in hasura/.hasura_version"
	exit 1
else
	echo "--> Version in hasura/Dockerfile and specified version in hasura/.hasura_version are consistent"
fi

# check that version used by the CI is the same as in .hasura_version file
CI_VERSION_IS_THE_SAME=$(grep "HASURA_VERSION: $HASURA_VERSION" '.github/workflows/test.yml')

if [ -z "$CI_VERSION_IS_THE_SAME" ]
then
	echo "--> Error: Version in .github/workflows/test.yml mismatches specified version in hasura/.hasura_version"
	exit 2
else
	echo "--> Version in .github/workflows/test.yml and specified version in hasura/.hasura_version are consistent"
fi
