#language: fr

Fonctionnalité: Modification d'une structure
	Pour pouvoir garder des informations d'une structure à jour
	En tant qu'admin de CdB
	Je veux pouvoir modifier à les informations d'une structure

	Scénario: Mise à jour d'une structure par l'administrateur CdB
		Soit un "administrateur cdb" authentifié avec l'email "support.carnet-de-bord+admin@fabrique.social.gouv.fr"
		Quand je clique sur "expérimentation 51"
		Alors je vois "1" dans la tuile "Structures"
		Quand je clique sur "1 structures"
		Alors je vois "Interlogement 51" dans le tableau "Liste des structures"
		Quand je clique sur "Éditer la structure Interlogement 51"
		Alors je suis sur la page "admin/deployment/c5c3a933-6f4a-4b2b-aa49-7a816eaef16b/structures/c0b8aee3-c061-4023-b57e-92880627d589"
		Alors je renseigne "51000" dans le champ "Code postal"
		Alors je renseigne "Châlons-en-Champagne" dans le champ "Ville"
		Quand je clique sur "Enregistrer les modifications"
		Alors je vois "Châlons-en-Champagne" sur la ligne "Interlogement 51"
