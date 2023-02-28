# Vérifier l’application

L’application bénéficie de tests frontend, backend et d’intégration (end-to-end). L’utilisation de chaque suite de test est documenté dans le dossier associé :

## Backend

Dans le répertoire racine du projet, lancez `./scripts/launch_tests.sh` pour lancer les dockers de test en local. PostgreSQL devrait alors écouter sur 5433. Pour s'y connecter :

    psql -U cdb -h localhost -p 5433 postgres;

Lancez dans le répertoire `backend` les tests pytest avec poetry :

    ENV_FILE=../.env.test poetry run pytest -s tests

Pour lancer les tests en mode watch :
```
ENV_FILE=../.env.test poetry run ptw --runner "pytest --testmon"
```

## Frontend

Deux suites de tests peuvent être exécutées avec `npm` :

- Elm : `npm run test:elm`
- Svelte : `npm run test:svelte`

## End-to-end

Le fonctionnement des tests est décrit dans [e2e/README.md](e2e/README.md).
Cheatsheet :
```bash
$ docker compose -f docker-compose-test.yaml up
$ npm --prefix e2e test
```
