#language: fr

@ajout_deploiement
Fonctionnalité: Déploiement
	Pour pouvoir ajouter un nouveau conseil départemental
	En tant qu'admin de CdB
	Je veux pouvoir créer un déploiement et l'attribuer à un administrateur PDI

Scénario: Création d'un déploiement
	Soit un utilisateur authentifié de type "admin_cdb"
	Alors je vois "Liste des déploiements"
	Alors je clique sur "Ajouter un Déploiement"
	Alors je renseigne "expérimentation e2e" dans le champ "Nom du déploiement"
	Alors je renseigne "experimentation-e2e@noreply.beta.gouv.fr" dans le champ "Courriel du gestionnaire"
	Quand je clique sur "Créer le déploiement"
	Alors je vois "expérimentation e2e"
