#language: fr

@manager_update_structure
Fonctionnalité: Modification d'un structure
	Pour pouvoir garder des informations d'une structure à jour
	En tant que manager
	Je veux pouvoir modifier à les informations d'une structure

	Scénario: Mise à jour d'une structure
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd51@fabrique.social.gouv.fr"
		Quand je clique sur "Structures"
		Alors je vois "Interlogement 51" dans le tableau "Liste des structures"
		Quand je clique sur "Éditer la structure Interlogement 51"
		Alors je renseigne "51000" dans le champ "Code postal"
		Alors je renseigne "Châlons-en-Champagne" dans le champ "Ville"
		Quand je clique sur "Mettre à jour"
		Alors je vois "Châlons-en-Champagne" sur la ligne "Interlogement 51"
