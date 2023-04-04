# Determine this makefile's path.
# Be sure to place this BEFORE `include` directives, if any.
THIS_FILE := $(lastword $(MAKEFILE_LIST))

install:
	-cp -n .env.sample .env
	-cp -n .env.test.sample .env.test
	pre-commit install
	@$(MAKE) -f $(THIS_FILE) .install-app
	@$(MAKE) -f $(THIS_FILE) .install-backend

.install-app:
	npm ci --prefix app

.install-backend:
	cd backend; \
		poetry install

seed-database:
	cd hasura; \
		hasura seed apply; \
		hasura console

start-app:
	npm --prefix app run dev

start-backend:
	cd backend; \
		poetry run uvicorn --reload cdb.api.main:app
