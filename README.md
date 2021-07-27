# carnet-de-bord

## développement

**pre-requis**:

- docker (version 20.10.5)
- docker-compose (version 1.29.0)
- node (version 16)
- hasura-cli (version 2.0.2)

**initialiser le projet**

```sh
#copier le projet
git clone git@github.com:SocialGouv/carnet-de-bord.git
cd carnet-de-bord

#installer les dépendances
yarn
yarn run husky install
```

**lancer en local**

```sh
# créer le fichier `.env`
cp .env.sample .env

# démarrer l'application svelte
yarn dev

# démarrer hasura et postgres
docker-compose up

# initialiser les données de test
cd hasura
hasura seed apply

# lancer la console hasura
hasura console
```

**hasura**:

- http://localhost:5000
- admin

**carnet de bord**:

- http://localhost:3000
