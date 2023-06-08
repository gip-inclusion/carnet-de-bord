.PHONY: help

.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# -------------------------------------
# Install
# -------------------------------------

install: .install-app .install-backend .install-e2e ## Installe toutes les dépendances (front, back et tests)
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
start-app: ## Démarre l'app frontend
	cd app; \
		npm run dev

start-backend: ## Démarre le backend
	cd backend; \
		poetry run uvicorn --reload cdb.api.main:app

start-storybook: ## Démarre storybook
	cd app && npm run dev:storybook

start: ## Démarre l'application dans tmux avec 4 panneaux
	./scripts/start.sh

# --------------------------------------
#  Test
# --------------------------------------
test-backend: ## Lance les tests du backend
	./scripts/launch_tests.sh python

test-backend-watch: ## Lance les tests du backend en mode watch
	./scripts/launch_tests.sh
	cd backend && \
		ENV_FILE=../.env.test poetry run ptw --runner "pytest --testmon"

test-app: ## Lance les tests de l'app frontend
	cd app && \
		npm run test


# -------------------------------------
# Other
# -------------------------------------
seed-database: ## Ajoute les données de test dans la base de donnée
	hasura --project ./hasura seed apply --database-name carnet_de_bord

update-schema: ## Met à jour le fichier de schéma graphql
	./scripts/update-schema.sh

codegen: update-schema
	# Nothing to do, code gen is automatically run on build

# -------------------------------------
# Elm
# -------------------------------------

elm-check: elm-compiles elm-test elm-review-fix ## Elm : Vérifie que le code Elm est prêt à être poussé sur le repository

elm-test: ## Elm : Lance les tests
	cd app && \
		npm run test:elm
elm-test-watch: ## Elm : Lance les tests en continu
	cd app && \
		npm run test:elm -- --watch

elm-compiles: ## Elm : Vérifie que toutes les apps Elm compilent
	bash ./scripts/all-elm-compiles.sh

elm-review: ## Elm : Lance un diagnostic
	cd app && \
		npm run lint:elm-review
elm-review-fix: ## Elm : Propose des corrections une par une
	cd app && \
		npx elm-review --fix
elm-review-suppress: ## Elm : Ignore les erreurs elm-review
	cd app && \
		npx elm-review suppress
