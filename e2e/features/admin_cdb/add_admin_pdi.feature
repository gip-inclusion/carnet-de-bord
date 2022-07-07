#language: fr

@add_admin_pdi
Fonctionnalité: Ajout d'un admin pdi
	Pour pouvoir gérer plus facilement l'administration d'un déploiement
	En tant qu'admininstrateur carnet de bord
	Je veux pouvoir rajouter un admin pdi a une déploiement

	Scénario: Ajout d'un admin pdi
		Soit un "administrateur cdb" authentifié avec l'email "support.carnet-de-bord+admin@fabrique.social.gouv.fr"
		Quand je clique sur "expérimentation 93"
		Alors je vois "Déploiement expérimentation 93"
		Quand je clique sur "Ajouter une admin pdi"
		Alors je renseigne "juste.leblanc@cd93.fr" dans le champ "Courriel"
		Alors je renseigne "Juste" dans le champ "Prénom"
		Alors je renseigne "Leblanc" dans le champ "Nom"
		Quand je clique sur "Ajouter l'admin"
		Alors je vois "Agathe DeBlouze, Juste Leblanc"
