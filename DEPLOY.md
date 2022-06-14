## DOCUMENTATION mise en prod

Afficher la [liste des workflows de production](https://github.com/SocialGouv/carnet-de-bord/actions/workflows/production.yml)
et sélectionner le dernier.

![image](https://user-images.githubusercontent.com/160320/173361957-bddf7d16-c567-47e5-8756-8225aa6be27c.png)

cliquer sur le bouton `Review deployments`

![image](https://user-images.githubusercontent.com/160320/173357836-f79557fa-9678-48ce-a34c-2d3a04a1de8c.png)

et cocher la case `production` avant de finaliser le process en cliquant sur `Approve and deploy`

![image](https://user-images.githubusercontent.com/160320/173357900-624fa369-303e-4bc4-bc3e-cecac139f39c.png)

## Résolution des éventuels problèmes

Préambule : Pour lancer les commandes de l'outils en ligne de commande hasura, il faut avoir la variable d'environnement suivante `HASURA_GRAPHQL_ADMIN_SECRET`

(disponible dans [rancher](https://rancher.fabrique.social.gouv.fr/dashboard/c/c-5rj5b/explorer/secret/carnet-de-bord/hasura-sealed-secret#data), ou via l'équipe SRE)

Lorsque suite à une mise en production, le modèle de données évolue, il est utile de vérifier que les migrations ont été appliquées. En local, lancer:

```
yarn hasura migrate status --endpoint https://hasura-carnet-de-bord.fabrique.social.gouv.fr --project=./hasura
```

qui permet de voir les migrations de la production et leur état d'application

![image](https://user-images.githubusercontent.com/160320/173358907-1d275f2d-d31c-4e0d-a7f6-dd45898bc949.png)

Dans le cas d'une migration qui a échoué, on utilise [grafana](https://grafana.fabrique.social.gouv.fr/explore?orgId=1&left=%7B%22datasource%22:%22Loki%22,%22queries%22:%5B%7B%22expr%22:%22%7Bnamespace%3D%5C%22carnet-de-bord%5C%22,%20job%3D%5C%22carnet-de-bord%2Fhasura%5C%22%7D%22,%22refId%22:%22A%22%7D%5D,%22range%22:%7B%22from%22:%22now-6h%22,%22to%22:%22now%22%7D%7D) pour avoir les log du container `hasura` et déterminé la cause de l'erreur.

Soit l'erreur est liée à des données et dans ce cas il faut corriger les données depuis le l'admin `hasura`

```
yarn hasura console --endpoint https://hasura-carnet-de-bord.fabrique.social.gouv.fr --project=./hasura
```

et relancer le container `hasura` (depuis [rancher](https://rancher.fabrique.social.gouv.fr/dashboard/c/c-5rj5b/explorer/workload) )

![image](https://user-images.githubusercontent.com/160320/173360950-ed8542f3-4e01-4555-b7ea-04425fd37cda.png)

Soit l'erreur vient du contenu de la migration (problème SQL) et dans ce cas, il faut corriger les fichiers sources et refaire une mise en production.
