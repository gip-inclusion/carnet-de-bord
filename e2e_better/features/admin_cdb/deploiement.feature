#language: fr

Fonctionnalité: Parcours Admin CdB
	Pour pouvoir ajouter un nouveau conseil départemental
	En tant qu'admin de CdB
	Je veux pouvoir créer un déploiement et l'attribuer à un Manager

	Scénario: Création d'un déploiement
		Soit un "administrateur cdb" authentifié avec l'email "contact+admin@carnetdebord.inclusion.beta.gouv.fr"
		Alors je vois "Liste des déploiements"
		Alors je clique sur "Ajouter un Déploiement"
		Alors je renseigne "expérimentation e2e" dans le champ "Nom du déploiement"
		Alors je renseigne "26" dans le champ "Département"
		Alors je renseigne "experimentation-e2e@noreply.beta.gouv.fr" dans le champ "Courriel du gestionnaire"
		Quand je clique sur "Créer le déploiement"
		Alors je vois "expérimentation e2e"
