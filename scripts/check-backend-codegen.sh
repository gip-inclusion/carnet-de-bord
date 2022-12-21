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
patterns=('hasura/metadata/**/*.yaml' 'hasura/metadata/**/*.graphql')
for pattern in $patterns; do
	hasura_files_ts="$(get_file_modification_timestamp $pattern)"
	generated_file_ts="$(get_file_modification_timestamp 'backend/api/_gen/schema_gql.py')"
	if [[ "$hasura_files_ts" -gt "$generated_file_ts" ]]; then
		echo $pattern
		echo $hasura_files_ts
		echo $generated_file_ts
		echo "Generated file is older than source file: codegen needs to be ran"
		exit 1
	fi
done
echo "Generated file is newer than source file: everything is fine."
