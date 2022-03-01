#language: fr

@pro
Fonctionnalité: Recherche de bénéficiaires dans l'annuaire
	En tant que pro
	Je veux pouvoir rechercher les bénéficiaires que je suis et accéder à leur carnet

Scénario: Recherche correcte de carnet
	Soit le pro "pierre.chevalier@livry-gargan.fr" qui a cliqué sur le lien de connexion
	Alors je vois "Rechercher un bénéficiaire"
	Quand je renseigne "Tifour" dans le champ "Rechercher un bénéficiaire"
	Quand je clique sur "Rechercher"
	Alors je vois "Sophie"
	Alors je vois "Tifour"
	Quand je renseigne "Inconnu" dans le champ "Rechercher un bénéficiaire"
	Quand je clique sur "Rechercher"
	Alors je ne vois pas "Sophie Tifour"
	Alors je vois "Désolé, aucun bénéficiaire"
