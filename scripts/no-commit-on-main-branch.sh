#!/bin/bash

branch=$(git rev-parse --abbrev-ref HEAD)

if [ $branch = 'main' ] && [ ! $CI  ]; then
	echo "Committing on main is forbidden."
	exit 1
fi
