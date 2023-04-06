# Vérifier l’application

L’application bénéficie de tests frontend, backend et d’intégration (end-to-end). L’utilisation de chaque suite de test est documenté dans le dossier associé :

## Backend

Lancez dans le répertoire racine du projet:
```
make test-backend
# ou en mode watch
make test-backend-watch
```
Pendant les tests, postgreSQL devrait écouter sur 5433. Pour s'y connecter :

    psql -U cdb -h localhost -p 5433 postgres;


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
