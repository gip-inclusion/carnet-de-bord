#!/bin/bash

# Modification timestamp is the newest date between commit date and file modification
function get_file_modification_timestamp() {
	local pattern=$1
	local fs_ts=$(for f in $(git status --porcelain "$pattern"|cut -c4-); do
		if [[ -f "$f" ]]; then date -r "$f" '+%s'; else date '+%s'; fi # for deleted files, we use the current date
	done)
	local commit_ts=$(git log -1 --format=%ct $pattern)
  if [[ "$commit_ts" -gt "$fs_ts" ]]; then
		echo "$commit_ts"
	else
		echo "$fs_ts"
	fi
}

gql_ts="$(get_file_modification_timestamp '*.gql')"
generated_file_ts="$(get_file_modification_timestamp 'app/src/lib/graphql/_gen/typed-document-nodes.ts')"

if [[ "$gql_ts" -gt "$generated_file_ts" ]]; then
	echo "Generated file is older than source file: codegen needs to be ran"
	exit 1
else
	echo "Generated file is newer than source file: everything is fine."
fi
