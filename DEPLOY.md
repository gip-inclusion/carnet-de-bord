## DOCUMENTATION mise en prod

Afficher la [liste des workflows de déploiement](../../actions/workflows/deploy.yml)
et sélectionner le plus récent.

Cliquer sur le bouton `Review deployments`

![image](https://user-images.githubusercontent.com/160320/173357836-f79557fa-9678-48ce-a34c-2d3a04a1de8c.png)

et cocher la case `production` avant de finaliser le process en cliquant sur `Approve and deploy`

![image](https://user-images.githubusercontent.com/160320/173357900-624fa369-303e-4bc4-bc3e-cecac139f39c.png)

## Résolution des éventuels problèmes

Préambule : Pour lancer les commandes de l'outils en ligne de commande hasura, il faut avoir la variable d'environnement suivante `HASURA_GRAPHQL_ADMIN_SECRET`

(disponible dans les variables d'environnement de l'application Scalingo)

Lorsque suite à une mise en production, le modèle de données évolue, il est utile de vérifier que les migrations ont été appliquées. En local, lancer:

```
hasura migrate status --endpoint https://hasura.carnetdebord.inclusion.beta.gouv.fr --project=./hasura
```

qui permet de voir les migrations de la production et leur état d'application

![image](https://user-images.githubusercontent.com/160320/173358907-1d275f2d-d31c-4e0d-a7f6-dd45898bc949.png)

Dans le cas d'une migration qui a échoué, consulter les logs sur Scalingo.

Soit l'erreur est liée à des données et dans ce cas il faut corriger les données depuis l'admin `hasura`

```
hasura console --endpoint https://hasura.carnetdebord.inclusion.beta.gouv.fr --project=./hasura
```

et relancer l'application Scalingo Hasura (`cdb-hasura-production`).

Soit l'erreur vient du contenu de la migration (problème SQL) et dans ce cas, il faut corriger les fichiers sources et refaire une mise en production.
