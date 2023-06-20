#language: fr

Fonctionnalité: Suppression d'un manager
	Pour pouvoir gérer plus facilement l'administration d'un déploiement
	En tant qu'admininstrateur carnet de bord
	Je veux pouvoir supprimer un manager d'un déploiement

	Scénario: Suppression d'un manager
		Soit un "administrateur cdb" authentifié avec l'email "contact+admin@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "expérimentation 51"
		Alors je vois "Déploiement expérimentation 51"
		Quand je clique sur "Supprimer Gérard Manvol"
		Alors je vois "Supprimer un responsable"
		Quand je clique sur "Oui" dans le volet "Supprimer un responsable"
		Alors je ne vois pas "Gérard Manvol"
