#!/bin/bash

HASURA_VERSION=$(cat hasura/.hasura_version)
echo "--> Version from .hasura_version file is $HASURA_VERSION"

# check that version in Dockerfile is the same as in .hasura_version file
DOCKERFILE_HASURA_VERSION=$(< hasura/Dockerfile awk -F= '/^ARG HASURA_VERSION=/ {print $2}')
echo "--> Version from hasura/Dockerfile file is $DOCKERFILE_HASURA_VERSION"

if [ "$HASURA_VERSION" = "$DOCKERFILE_HASURA_VERSION" ]
then
	echo "--> Version in hasura/Dockerfile and specified version in hasura/.hasura_version are consistent"
else
	echo "--> Error: Version in hasura/Dockerfile mismatches specified version in hasura/.hasura_version"
	exit 1
fi
