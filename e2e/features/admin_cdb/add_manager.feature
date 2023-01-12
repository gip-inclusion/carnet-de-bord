#language: fr

Fonctionnalité: Ajout d'un manager
	Pour pouvoir gérer plus facilement l'administration d'un déploiement
	En tant qu'admininstrateur carnet de bord
	Je veux pouvoir rajouter un administrateur de territoire à un déploiement

	Scénario: Ajout d'un manager
		Soit un "administrateur cdb" authentifié avec l'email "support.carnet-de-bord+admin@fabrique.social.gouv.fr"
		Quand j'attends que le tableau "Liste des déploiements" apparaisse
		Quand je clique sur "expérimentation 93"
		Alors je vois "Déploiement expérimentation 93"
		Quand je clique sur "Ajouter un administrateur de territoire"
		Alors je renseigne "juste.leblanc@cd93.fr" dans le champ "Courriel"
		Alors je renseigne "Juste" dans le champ "Prénom"
		Alors je renseigne "Leblanc" dans le champ "Nom"
		Quand je clique sur "Ajouter l'admin"
		Alors je vois "Juste Leblanc" dans le tableau "Liste des managers"
