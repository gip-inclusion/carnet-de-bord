#language: fr

Fonctionnalité: Recherche de bénéficiaires sur l'annuaire
	En tant que pro
	Je veux pouvoir rechercher les bénéficiaires que je suis et accéder à leur carnet

Scénario: Annuaire des bénéficiaires
	Soit le pro "pierre.chevalier@livry-gargan.fr" qui a cliqué sur le lien de connexion
	Quand je clique sur "Annuaire des bénéficiaires"
	Alors je vois "Annuaire des bénéficiaires"
	Alors je vois "Vous pouvez recherche un bénéficiaire"

Scénario: Recherche d'un carnet existant depuis l'annuaire
	Soit le pro "pierre.chevalier@livry-gargan.fr" qui a cliqué sur le lien de connexion
	Quand je clique sur "Annuaire des bénéficiaires"
	Quand je renseigne "Tifour" dans le champ "Rechercher un bénéficiaire"
	Quand je clique sur "Rechercher"
	Alors je vois "Sophie"
	Alors je vois "Tifour"

Scénario: Recherche de carnet hors groupe de suivi
	Soit le pro "pierre.chevalier@livry-gargan.fr" qui a cliqué sur le lien de connexion
	Quand je clique sur "Annuaire des bénéficiaires"
	Quand je renseigne "Connor" dans le champ "Rechercher un bénéficiaire"
	Quand je clique sur "Rechercher"
	Alors je vois "Oconnor"

Scénario: Recherche d'un bénéficiaire hors déploiement
	Soit le pro "pierre.chevalier@livry-gargan.fr" qui a cliqué sur le lien de connexion
	Quand je clique sur "Annuaire des bénéficiaires"
	Quand je renseigne "Saintpa" dans le champ "Rechercher un bénéficiaire"
	Quand je clique sur "Rechercher"
	Alors je vois "aucun bénéficiaire"
