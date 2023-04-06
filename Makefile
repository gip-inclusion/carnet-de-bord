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
	cd app; \
		npm install

.install-backend:
	cd backend; \
		poetry install

.install-e2e:
	cd e2e; \
		npm install

seed-database:
	cd hasura; \
		hasura seed apply; \
		hasura console

# -------------------------------------
# Start
# -------------------------------------
start-app:
	cd app; \
		npm run dev

start-backend:
	cd backend; \
		poetry run uvicorn --reload cdb.api.main:app
