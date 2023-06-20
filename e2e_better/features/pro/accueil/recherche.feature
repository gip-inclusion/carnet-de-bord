#language: fr

Fonctionnalité: Recherche de bénéficiaires sur l'accueil
	En tant que pro
	Je veux pouvoir rechercher les bénéficiaires que je suis et accéder à leur carnet

Scénario: Recherche d'un carnet existant depuis l'accueil
	Soit le pro "pierre.chevalier@livry-gargan.fr" qui a cliqué sur le lien de connexion
	Alors je vois "Rechercher un bénéficiaire"
	Quand je renseigne "Tifour" dans le champ "Rechercher un bénéficiaire"
	Quand je clique sur "Rechercher"
	Alors je vois "Sophie"
	Alors je vois "Tifour"

Scénario: Recherche de carnet inexistant depuis l'accueil
	Soit le pro "pierre.chevalier@livry-gargan.fr" qui a cliqué sur le lien de connexion
	Alors je vois "Rechercher un bénéficiaire"
	Quand je renseigne "Inconnu" dans le champ "Rechercher un bénéficiaire"
	Quand je clique sur "Rechercher"
	Alors je vois "aucun bénéficiaire"
