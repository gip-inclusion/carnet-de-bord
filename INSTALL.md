# Guide d'installation

## Prérequis

Vous devez au préalable avoir correctement installé les logiciels suivants :

- docker (version 20.10.5)
- docker-compose (version 1.29.0)
- node (version 16)
- hasura-cli (latest)
- pre-commit https://pre-commit.com
- poetry (1.2)

> ℹ️️ Les versions indiquées sont celles utilisées et préconisées par l'équipe de développement. Il est possible que l'application fonctionne avec des versions différentes.

> ⚠️ Assurez-vous que les ports **5000** (Hasura) et **5432** (PostgreSQL) soient libres d'écoute. Le cas échéant, vous pouvez changer les ports dans les fichiers de configuration ou d'environnement de l'application.

## Étapes

**1/** Récupérer les sources du projet

```sh
git clone git@github.com:gip-inclusion/carnet-de-bord.git
cd carnet-de-bord
```

**2/** Créer et adapter les fichiers d'environnement

```sh
cp .env.sample .env
````

**3/** Récupérer les dépendances du projet

```sh
npm ci --prefix app # installer les dépendances de l'application
pre-commit install # installer les hooks Git
```

> ℹ️ Parmi les dépendances de développement du projet (cf. [package.json](./app/package.json)), on retrouve la CLI Hasura, utile pour l'étape #5.

**4/** Démarrer les composants tiers

L'application repose sur Hasura et PostgreSQL. Une [stack docker-compose](./docker-compose.yaml) est maintenue par l'équipe pour instancier et démarrer ces services.

```sh
docker compose up
```

**5/** Alimenter la base de données

Dans un second terminal :

```sh
cd hasura
hasura seed apply # initialiser les données de test
hasura console # lancer la console hasura
```
ou
```sh
hasura console --envfile ../.env # lancer la console hasura en utilisant les variables définies dans le fichier .env
```

**6/** Compiler et démarrer l'application SvelteKit

Dans un troisième terminal :

```sh
npm --prefix app run dev # démarrer le serveur de développement SvelteKit
```

**7/** Configurer et démarrer l'API back-end métier

Dans un quatrième et dernier terminal
```sh
cd backend
poetry install # installer les dépendances python
poetry run uvicorn --reload cdb.api.main:app # démarrer l'instance de serveur FastAPI
```

**8/** Accéder aux applications & outils (cf. captures ci-dessous)

- Webapp SvelteKit → http://localhost:3000
- API FastAPI → http://localhost:8000/docs
- Console Hasura →  http://localhost:9695

**9/** Accéder aux différents comptes de démonstration

L'équipe maintient des comptes de démo, renseignés dans le fichier [DEMO.md](./DEMO.md).


## Captures d'écran

**Page d'accueil** de [l'application SvelteKit](http://localhost:3000).

![Webapp SvelteKit](./docs/screenshot_webapp.png)

**Documentation Swagger** de [l'API FastAPI](http://localhost:8000/docs)

![Documentation Swagger](./docs/screenshot_swagger_api.png)

**Console Hasura** dont [l'instance](http://localhost:9695) est correctement alimentée en données (cf. onglet "Data") :

![Console Hasura](./docs/screenshot_hasura_console.png)
