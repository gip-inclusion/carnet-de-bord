# CDB PYTHON API

## docker cheatsheet

build the image

```sh
docker build . -t cdb_api:local
```

Run the image on port 4000

```sh
docker run --rm -p 4000:4000 --name cdb_api cdb_api:local
```
