# CdB Python Backend

Vous allez avoir besoin de python 3.9+ d'installé. Le backend utilise `poetry` pour gérer ses dépendances et ses environnements.
Pour installer `poetry`, référez-vous aux instructions de la [documentation poetry](https://python-poetry.org/docs/#installation)

## Installation

```sh
poetry install
```

## Api

```sh
ENV_FILE=../../../frontend/.env poetry run uvicorn --reload api.main:app
```

### Documentation

Grâce à FastAPI, vous pouvez trouver une documentation swagger à jour sur l'URL http://localhost:8000/docs

### docker cheatsheet

Construire l'image

```sh
docker build . -t cdb_backend:local
```

Lancer l'image sur le port 4000

```sh
docker run --rm -p 4000:4000 --name cdb_backend cdb_backend:local
```

## Scripts

    HASURA_GRAPHQL_DATABASE_URL=postgres://cdb:test@localhost:5432/carnet_de_bord poetry run python scripts/connect_to_db.py

## Tests

Dans le répertoire racine du projet, lancez `./scripts/launch_tests.sh` pour lancer les dockers de test en local. PostgreSQL devrait alors écouter sur 5433. Pour s'y connecter :

    psql -U cdb -h localhost -p 5433 postgres;

Copiez le fichier `.env.test.sample` vers `.env.test`. Ensuite, lancez dans le répertoire `backend` les tests pytest avec poetry :

    ENV_FILE=../.env.test poetry run pytest -s tests
