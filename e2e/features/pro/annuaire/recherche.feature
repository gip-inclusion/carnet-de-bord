#language: fr

@pro
Fonctionnalité: Recherche de bénéficiaires sur l'annuaire
	En tant que pro
	Je veux pouvoir rechercher les bénéficiaires que je suis et accéder à leur carnet

Scénario: Annuaire des bénéficiaires
	Soit le pro "pierre.chevalier@livry-gargan.fr" qui a cliqué sur le lien de connexion
	Quand je clique sur "Annuaire de mes bénéficiaires"
	Alors je vois "Annuaire de mes bénéficiaires"
	Alors je vois "Sophie"
	Alors je vois "Tifour"

Scénario: Recherche correcte de carnet existant
	Soit le pro "pierre.chevalier@livry-gargan.fr" qui a cliqué sur le lien de connexion
	Quand je clique sur "Annuaire de mes bénéficiaires"
	Quand je renseigne "Tifour" dans le champ "Rechercher un bénéficiaire"
	Quand je clique sur "Rechercher"
	Alors je vois "Sophie"
	Alors je vois "Tifour"


Scénario: Recherche correcte de carnet inexistant
	Soit le pro "pierre.chevalier@livry-gargan.fr" qui a cliqué sur le lien de connexion
	Quand je clique sur "Annuaire de mes bénéficiaires"
	Quand je renseigne "Inconnu" dans le champ "Rechercher un bénéficiaire"
	Quand je clique sur "Rechercher"
	Alors je vois "aucun bénéficiaire"
