# CdB Python Backend

Vous allez avoir besoin de python 3.9+ d'installé. Le backend utilise `poetry` pour gérer ses dépendances et ses environnements.
Pour installer `poetry`, référez-vous aux instructions de la [documentation poetry](https://python-poetry.org/docs/#installation)

## Installation

```sh
poetry install
```

## Api

```sh
poetry run uvicorn --reload cdb.api.main:app
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
