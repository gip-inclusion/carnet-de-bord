#!/bin/bash

# To determine if codegen needs to be ran, modification and commit dates
# of all *.gql files and the generated file are computed, and then sorted.
# For this we use git log and git status commands.
# The most recent date is kept.
# Finally, the most recent date shall be the one of the generated file.
# Otherwise, it means that genereted file has to be re-generated.

for i in "*.gql" app/src/lib/graphql/_gen/typed-document-nodes.ts;
do echo $(git log -1 --format=%ct $i) $i;
	git status --porcelain "$i" |cut -c4-|xargs stat -f "%m %N";
done | sort | tail -1 | grep -F "app/src/lib/graphql/_gen/typed-document-nodes.ts"
