#language: fr

Fonctionnalité: Modification d'un structure
	Pour pouvoir garder des informations d'une structure à jour
	En tant qu'admin de CdB
	Je veux pouvoir modifier à les informations d'une structure

	Scénario: Mise à jour d'une structure
		Soit un "administrateur cdb" authentifié avec l'email "support.carnet-de-bord+admin@fabrique.social.gouv.fr"
		Quand je clique sur "expérimentation 51"
		Alors je vois "1" dans la tuile "Structures"
		Quand je clique sur "1 structures"
		Alors je vois "Interlogement 51" dans le tableau "Liste des structures"
		Quand je clique sur "Éditer la structure Interlogement 51"
		Alors je renseigne "51000" dans le champ "Code postal"
		Alors je renseigne "Châlons-en-Champagne" dans le champ "Ville"
		Quand je clique sur "Mettre à jour"
		Alors je vois "Châlons-en-Champagne" sur la ligne "Interlogement 51"
