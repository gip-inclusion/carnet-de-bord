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

	Scénario: Mise à jour des dispositifs d'accompagnement d'une structure par l'administrateur CdB
		Soit un "administrateur de territoire" authentifié avec l'email "support.carnet-de-bord+cd51@fabrique.social.gouv.fr"
		Quand je clique sur "Structures"
		Alors je vois "Interlogement 51" dans le tableau "Liste des structures"
		Alors je vois "PE (Professionnel)" sur la ligne "Interlogement 51"
		Alors je vois "RIA (Professionnel)" sur la ligne "Interlogement 51"
		Quand je clique sur "Éditer la structure Interlogement 51"
		Alors je suis sur la page "manager/structures/c0b8aee3-c061-4023-b57e-92880627d589"
    Alors l'option "PE (Professionnel)" est sélectionnée
    Alors l'option "RIA (Professionnel)" est sélectionnée
    Alors je décoche "PE (Professionnel)"
    Alors je décoche "RIA (Professionnel)"
		Quand je clique sur "Enregistrer les modifications"
		Alors je ne vois pas "PE (Professionnel)" sur la ligne "Interlogement 51"
		Alors je ne vois pas "RIA (Professionnel)" sur la ligne "Interlogement 51"
