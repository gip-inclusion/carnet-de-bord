#!/bin/bash

# Modification timestamp is the newest date between commit date and file modification
function get_file_modification_timestamp() {
	local pattern=$1
	local fs_ts=$(for f in $(git status --porcelain "$pattern"|cut -c4-); do
		if [[ -f "$f" ]]; then date -r "$f" '+%s'; else
      # for deleted files, we use yesterday (3600*24*86400) at
      # the same time
      current_ts="$(date '+%s') - 86400";
      echo $current_ts
    fi
	done | sort -rg | head -1)
	local commit_ts=$(git log -1 --format=%ct "$pattern")
  if [[ "$commit_ts" -gt "$fs_ts" ]]; then
		echo "$commit_ts"
	else
		echo "$fs_ts"
	fi
}

for pattern in 'app/*.gql'; do
	gql_ts="$(get_file_modification_timestamp "$pattern")"
	generated_file_ts="$(get_file_modification_timestamp 'app/src/lib/graphql/_gen/typed-document-nodes.ts')"
	if [[ "$gql_ts" -gt "$generated_file_ts" ]]; then
		echo "Generated file is older than source file: codegen needs to be ran"
		exit 1
	fi
done
echo "Generated file is newer than source file: everything is fine."
