#language: fr

Fonctionnalité: Modification d'une structure
	Pour pouvoir garder des informations d'une structure à jour
	En tant que manager
	Je veux pouvoir modifier à les informations d'une structure

	Scénario: Mise à jour d'une structure
		Soit un "administrateur de territoire" authentifié avec l'email "contact+cd51@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "Structures"
		Alors je vois "Interlogement 51" dans le tableau "Liste des structures"
		Quand je clique sur "Éditer la structure Interlogement 51"
		Alors je suis sur la page "manager/structures/c0b8aee3-c061-4023-b57e-92880627d589"
		Alors je renseigne "51000" dans le champ "Code postal"
		Alors je renseigne "Châlons-en-Champagne" dans le champ "Ville"
		Quand je clique sur "Enregistrer les modifications"
		Alors je vois "Châlons-en-Champagne" sur la ligne "Interlogement 51"

	Scénario: Mise à jour des dispositifs d'accompagnement d'une structure
		Soit un "administrateur de territoire" authentifié avec l'email "contact+cd51@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "Structures"
		Alors je vois "Interlogement 51" dans le tableau "Liste des structures"
		Alors je vois "PE" sur la ligne "Interlogement 51"
		Alors je vois "RIA" sur la ligne "Interlogement 51"
		Quand je clique sur "Éditer la structure Interlogement 51"
		Alors je suis sur la page "manager/structures/c0b8aee3-c061-4023-b57e-92880627d589"
		Alors l'option "PE" est sélectionnée
		Alors l'option "RIA" est sélectionnée
		Alors je décoche "PE"
		Alors je décoche "RIA"
		Quand je clique sur "Enregistrer les modifications"
		Alors je ne vois pas "PE" sur la ligne "Interlogement 51"
		Alors je ne vois pas "RIA" sur la ligne "Interlogement 51"
