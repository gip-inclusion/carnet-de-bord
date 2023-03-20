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

function wait_for_app_deployment() {
  local service=$1
  local appname=$(get_review_app_name $service)
  inProgressStatuses='queued|building|pushing|starting'

  log "* Waiting for $appname to be deployed..."

  local waited=0
  local status

  while [[ $waited -lt $TIMEOUT ]]; do
    status=$(scalingo --app $appname deployments 2> /dev/null | awk -F' *[|] *' 'NR == 4 {print $7;}')
    log "  - $appname deployment status is now: $status"
    if [[ "$status" == success ]]; then
      return
    fi
    if [[ ! "$status" =~ $inProgressStatuses ]]; then
      scalingo --app $appname deployment-logs
      log "ERROR: $appname deployment ended with $status"
      exit 2
    fi
    sleep 5
    waited=$((waited + 5))
  done

  log "ERROR: $appname was not deployed after $TIMEOUT seconds"
  exit 1
}


function wait_for_apps_deployment() {
  wait_for_app_deployment app
  wait_for_app_deployment backend
  wait_for_app_deployment hasura
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

wait_for_apps_deployment
