#language: fr

Fonctionnalité: Modification d'une structure
	Pour pouvoir garder des informations d'une structure à jour
	En tant que manager
	Je veux pouvoir modifier à les informations d'une structure

	Scénario: Mise à jour d'une structure
		Soit un "administrateur de territoire" authentifié avec l'email "support.carnet-de-bord+cd51@fabrique.social.gouv.fr"
		Quand je clique sur "Structures"
		Alors je vois "Interlogement 51" dans le tableau "Liste des structures"
		Quand je clique sur "Éditer la structure Interlogement 51"
		Alors je suis sur la page "manager/structures/c0b8aee3-c061-4023-b57e-92880627d589"
		Alors je renseigne "51000" dans le champ "Code postal"
		Alors je renseigne "Châlons-en-Champagne" dans le champ "Ville"
		Quand je clique sur "Enregistrer les modifications"
		Alors je vois "Châlons-en-Champagne" sur la ligne "Interlogement 51"
