# Determine this makefile's path.
# Be sure to place this BEFORE `include` directives, if any.
THIS_FILE := $(lastword $(MAKEFILE_LIST))

# -------------------------------------
# Install
# -------------------------------------

install:
	-cp -n .env.sample .env
	-cp -n .env.test.sample .env.test
	pre-commit install
	@$(MAKE) -f $(THIS_FILE) .install-app
	@$(MAKE) -f $(THIS_FILE) .install-backend
	@$(MAKE) -f $(THIS_FILE) .install-e2e

.install-app:
	cd app && \
		npm ci

.install-backend:
	cd backend; \
		poetry install

.install-e2e:
	cd e2e; \
		npm ci

# -------------------------------------
# Start
# -------------------------------------
start-app:
	cd app; \
		npm run dev

start-backend:
	cd backend; \
		poetry run uvicorn --reload cdb.api.main:app

# --------------------------------------
#  Test
# --------------------------------------
test-backend:
	./scripts/launch_tests.sh python

test-backend-watch:
	./scripts/launch_tests.sh
	cd backend; \
		ENV_FILE=../.env.test poetry run ptw --runner "pytest --testmon"

test-app:
	cd app;
		npm run test


# -------------------------------------
# Other
# -------------------------------------
seed-database:
	hasura --project ./hasura seed apply --database-name carnet_de_bord

codegen:
	cd backend; \
		poetry run cdb/scripts/codegen.py
	cd app; \
		npm run codegen
