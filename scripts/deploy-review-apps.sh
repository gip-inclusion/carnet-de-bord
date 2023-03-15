#!/bin/bash

set -euo pipefail

TIMEOUT=600

PR=${1:?PR number required}
BRANCH=${2:?branch name required}
SUFFIX=-review-pr${PR}

function log() {
  local msg=$1

  >&2 echo "$msg"
}

function get_review_app_name() {
  local service=$1
  echo cdb-$service$SUFFIX
}

function wait_for_service_status() {
  local service=$1
  local status_re=$2

  local appname=$(get_review_app_name $service)

  log "* Waiting for $appname to be $status_re..."

  local waited=0
  local status

  while [[ $waited -lt $TIMEOUT ]]; do
    status=$(scalingo -a $appname apps-info 2>/dev/null|awk '/Status/{print $4}' || true)
    log "  - $appname is now: $status"
    if [[ "$status" =~ $status_re ]]; then
      return
    fi
    sleep 5
    waited=$((waited + 5))
  done

  log "ERROR: $appname was not $status_re after $TIMEOUT seconds"
  exit 1
}


function wait_for_apps_status() {
  local status_re=$1

  wait_for_service_status app "$status_re"
  wait_for_service_status backend "$status_re"
  wait_for_service_status hasura "$status_re"
}

function deploy_app() {
  local app=$1

  scalingo -a "$app" integration-link-manual-deploy "$BRANCH"
}

function deploy_apps() {
  log "* Deploying apps..."

  deploy_app "$(get_review_app_name hasura)"
  deploy_app "$(get_review_app_name backend)"
  deploy_app "$(get_review_app_name app)"
}

log "Deploying review apps for PR #${PR}"

deploy_apps

wait_for_apps_status 'running'
