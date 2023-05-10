#!/bin/bash

set -euo pipefail

TIMEOUT=600

PR=${1:?PR number required}
SUFFIX=-review-pr${PR}

function log() {
  local msg=$1

  >&2 echo "$msg"
}

function get_parent_app_name() {
  local service=$1
  echo cdb-$service-review
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

function wait_for_addons_running() {
  local appname=$1

  log "* Waiting for ${appname}'s addons to be running..."

  local waited=0

  while [[ $waited -lt $TIMEOUT ]]; do
    if scalingo -a $appname addons 2>/dev/null|grep "running" >/dev/null; then
      return
    fi
    sleep 5
    waited=$((waited + 5))
  done

  log "ERROR: ${appname}'s addons were not running after $TIMEOUT seconds"
  exit 1
}

function wait_for_apps_status() {
  local status_re=$1

  wait_for_service_status app "$status_re"
  wait_for_service_status backend "$status_re"
  wait_for_service_status hasura "$status_re"
}

function get_database_url() {
  scalingo -a $(get_review_app_name hasura) env-get SCALINGO_POSTGRESQL_URL
}

function compute_urls() {
  APP_URL=https://$(get_review_app_name app).osc-fr1.scalingo.io
  BACKEND_URL=https://$(get_review_app_name backend).osc-fr1.scalingo.io
  GRAPHQL_URL=https://$(get_review_app_name hasura).osc-fr1.scalingo.io/v1/graphql
  DATABASE_URL=$(get_database_url)
}

function env_set() {
  local service=$1
  local var=$2
  local value=$3

  local appname=$(get_review_app_name $service)

  log "* Setting $var on $appname"

  # Redirect to /dev/null to avoid printing secrets to the logs
  scalingo -a $appname env-set "$var=$value" >/dev/null 2>&1
}

function set_backend_env() {
  env_set backend DATABASE_URL "$DATABASE_URL"
  env_set backend APP_URL "$APP_URL"
  env_set backend GRAPHQL_API_URL "$GRAPHQL_URL"
}

function set_hasura_env() {
  env_set hasura ACTION_BASE_URL "$APP_URL/actions"
  env_set hasura BACKEND_API_URL "$BACKEND_URL"
  env_set hasura BACKEND_API_ACTION_URL "$BACKEND_URL"
}

function set_app_env() {
  env_set app APP_URL "$APP_URL"
  env_set app BACKEND_API_URL "$BACKEND_URL"
  env_set app GRAPHQL_API_URL "$GRAPHQL_URL"
}

function create_apps() {
  log "* Creating apps..."

  scalingo -a "$(get_parent_app_name hasura)" integration-link-manual-review-app "$PR"
  scalingo -a "$(get_parent_app_name hasura)" integration-link-update --no-auto-deploy
  scalingo -a "$(get_parent_app_name backend)" integration-link-manual-review-app "$PR"
  scalingo -a "$(get_parent_app_name backend)" integration-link-update --no-auto-deploy
  scalingo -a "$(get_parent_app_name app)" integration-link-manual-review-app "$PR"
  scalingo -a "$(get_parent_app_name app)" integration-link-update --no-auto-deploy

  wait_for_addons_running "$(get_review_app_name hasura)"
}

function deploy_app() {
  local app=$1

  # Sample "scalingo integration-link" output:
  #
  #   Application: cdb-app-review-pr1194 (6356af2f623d3a0010ba5db2)
  #   Integration: GitHub (185f8b27-5abb-49f0-9d27-18add5460eb8)
  #   Linker: service-dev
  #   Repository: gip-inclusion/carnet-de-bord
  #   Auto Deploy: ✔ gip-inclusion:chore/move-back-jest-test-folder
  #   Review Apps Deploy: ✘

  local branch="$(scalingo -a "$app" integration-link | awk -F: '/Auto/{print $3}')"

  scalingo -a "$app" integration-link-manual-deploy "$branch"
}

function deploy_apps() {
  log "* Deploying apps..."

  deploy_app "$(get_review_app_name hasura)"
  deploy_app "$(get_review_app_name backend)"
  deploy_app "$(get_review_app_name app)"
}

function stop_apps() {
  # To avoid overloading PG connections it's safer to stop apps
  # before restarting them.
  log "* Stopping apps..."

  # The Scalingo API returns an error when trying to stop an
  # app that is already stopped, we'll ignore all errors and$
  # hope not to miss anything important.
  scalingo -a "$(get_review_app_name hasura)" scale web:0 || true
  scalingo -a "$(get_review_app_name backend)" scale web:0 || true
  scalingo -a "$(get_review_app_name app)" scale web:0 || true
}

function start_apps() {
  log "* Starting apps..."

  scalingo -a "$(get_review_app_name hasura)" scale web:1:M
  scalingo -a "$(get_review_app_name backend)" scale web:1:S
  scalingo -a "$(get_review_app_name app)" scale web:1:S
}

log "Creating review apps for PR #${PR}"

create_apps

# Force a deployment, in case the initial deployment was prevented by another GitHub check
deploy_apps

log "Linking apps with suffix: ${SUFFIX?}"

wait_for_apps_status 'stopped|running'

stop_apps

wait_for_apps_status 'stopped'

compute_urls

set_backend_env
set_hasura_env
set_app_env

start_apps

wait_for_apps_status 'running'
