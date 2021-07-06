# carnet-de-bord

## développement

copier le projet

```sh
git clone git@github.com:SocialGouv/carnet-de-bord.git

cd carnet-de-bord
```

installer les dépendances

```sh
yarn

yarn run husky install
```

démarrer la base de données

```sh
docker-compose up
```

migrer les données

```
yarn run knex migrate:latest
```
