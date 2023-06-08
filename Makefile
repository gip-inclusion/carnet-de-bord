# -------------------------------------
# Install
# -------------------------------------

install: .install-app .install-backend .install-e2e
	-cp -n .env.sample .env
	-cp -n .env.test.sample .env.test
	pre-commit install

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

start-storybook:
	cd app && npm run dev:storybook

start: ## Démarre l'application dans tmux avec 4 panneaux
	./scripts/start.sh

# --------------------------------------
#  Test
# --------------------------------------
test-backend:
	./scripts/launch_tests.sh python

test-backend-watch:
	./scripts/launch_tests.sh
	cd backend && \
		ENV_FILE=../.env.test poetry run ptw --runner "pytest --testmon"

test-app:
	cd app && \
		npm run test


# -------------------------------------
# Other
# -------------------------------------
seed-database:
	hasura --project ./hasura seed apply --database-name carnet_de_bord

update-schema:
	./scripts/update-schema.sh

codegen: update-schema
	# Nothing to do, code gen is automatically run on build

# -------------------------------------
# Elm
# -------------------------------------

elm-check: elm-compiles elm-test review-fix

elm-test:
	cd app && \
		npm run test:elm
elm-test-watch:
	cd app && \
		npm run test:elm -- --watch

elm-compiles:
	bash $(ROOT_DIR)/scripts/all-elm-compiles.sh

elm-review:
	cd app && \
		npm run lint:elm-review
elm-review-fix:
	cd app && \
		npx elm-review --fix
elm-review-suppress:
	cd app && \
		npx elm-review suppress
