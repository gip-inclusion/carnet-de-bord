#language: fr

@deploiement
Fonctionnalité: Déploiement
	Pour pouvoir ajouter un nouveau conseil départemental
	En tant qu'admin de CdB
	Je veux pouvoir créer un déploiement

Scénario:
	Soit un administrateur CdB authentifié sur la page "/admin"
	Alors je vois "Liste des déploiements"
	Alors je clique sur "Ajouter un Déploiement"
	Alors je renseigne "expérimentation e2e" dans le champ "Nom du déploiement"
	Alors je renseigne "expérimentation-e2e@noreply.beta.gouv.fr" dans le champ "Courriel du gestionnaire"
#	Alors je clique sur "Créer le déploiement"

