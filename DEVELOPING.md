# Guide de développement
## Docker

Les fichiers `docker-compose*.yaml` sont nommés pour faciliter le démarrage et l'arrêt des environnement de développement ou de test en local.

```sh
# démarrer l'environnement de test en local
docker compose -f docker-compose-test.yaml up
# arrêter l'environnement de test en local
docker compose -f docker-compose-test.yaml down
```

## Données, GraphQL et Hasura

**Génération des types graphql**

on écrit un fichier `_query.gql` ou `_mutation.gql`

```gql
# _query.gql
query SearchBeneficiaries($filter: String) {
	beneficiary(
		where: {
			_or: [
				{ peNumber: { _ilike: $filter } }
				{ cafNumber: { _ilike: $filter } }
				{ lastname: { _ilike: $filter } }
				{ mobileNumber: { _ilike: $filter } }
			]
		}
	) {
		dateOfBirth
		firstname
		id
		lastname
		mobileNumber
	}
}
```

Avec **l’environnement de dev démarré**, on génère les types avec `codegen` :

```sh
make codegen
```
Le schéma est écrit dans un module Python `backend.cdb.api._gen.schema_gql`.
Les types graphql sont générés dans `src/_gen`. On peut alors les utiliser dans les composants

```ts
export const load: Load = async ({ page }) => {
	const filter = page.query.get('filter');
	const result = operationStore(SearchBeneficiariesDocument, {
		filter: `%${filter}%`,
	});

	return {
		props: {
			result,
			filter,
		},
	};
};
```

**Modification des metadata Hasura**

Après avoir modifié des metadatas hasura dans la console (permissions, GraphQL field name, etc), ne pas oublier de les exporter

```sh
# depuis le répertoire ~/hasura
hasura metadata export
```

**Migration de la base de données**

Si les modifications du schéma de la base de données sont faites à partir de la console hasura `http://localhost:9695/console`, hasura génère automatiquement des fichiers de migrations dans `hasura/migrations`.

Avant de `merge` une PR, ne pas oublier de (squash)[https://hasura.io/docs/latest/graphql/core/hasura-cli/hasura_migrate_squash.html] les fichiers.

Les migrations sont appliquées automatiquement au lancement de hasura

```sh
# depuis le répertoire racine
docker compose up --build
```

## Pratiques de l'équipe

### Git
Les modifications apportées au code doivent passer par des PR qui seront validées avant de pouvoir être versées dans la branche principale. On n'assigne pas forcément de relecteur, tout le monde est libre de relire la PR d'une autre personne.

Dans le cas où une personne de l'équipe de dev est seule, elle peut valider sa PR elle-même pour pouvoir avancer.

Lorsque la PR est validée, on laisse le soin à l'auteur de la PR de faire le merge.

L'équipe privilégie les "squash and merge" avec un message de commit qui suit le formalisme [conventional commit](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) de manière à pouvoir générer le fichier [CHANGELOG.md](./CHANGELOG.md) automatiquement.

### Prise de décision

Les décisions structurantes sont expliquées dans des _Architecture Decision Records_ (ADR), situées dans [le dossier docs/adr](./docs/adr).

## Gestion des mails sur les environnements de développement (review / preprod)

Pour les environnements de review et la preprod, les mails envoyés par l'application sont visibles sur une instance de [mailtrap](https://mailtrap.io) (Les accès se trouvent dans bitwarden).

## Howto

#### Exécuter un fichier de migration directement via postgres

```sh
docker compose exec -T db psql --dbname carnet_de_bord --user cdb  < hasura/migrations/carnet_de_bord/${migration_name}/${up|down}.sql
```

#### Faire une requête GraphQL portant sur une absence de relation

Si la table `account` peut porter un `professional_id`, il n'est pas possible de faire la requête suivante, pourtant valide pour des propriétés "internes" :

```graphql
query GetProfessionalsNotLinkedFromAccount {
	professional_aggregate(where: { account: { _is_null: true } }) {
		aggregate {
			count
		}
	}
}
```

Il faut la formuler comme suit :

```graphql
query GetProfessionalsNotLinkedFromAccount {
	professional_aggregate(where: { _not: { account: {} } }) {
		aggregate {
			count
		}
	}
}
```
