# CDB PYTHON BACKEND

You will need python3 to be installer
The backend sue poetry to manage its deps and env
To install poetry, you can refer to the [poetry documentation](https://python-poetry.org/docs/#installation)

## Install

```sh
poetry install
```

## Development

```sh
poetry run uvicorn --reload api.main:app
```

## Documentation

Thanks to fastapi, you can find an up-to-date swagger documentation on http://localhost:8000/docs

## docker cheatsheet

build the image

```sh
docker build . -t cdb_backend:local
```

Run the image on port 4000

```sh
docker run --rm -p 4000:4000 --name cdb_backend cdb_backend:local
```
