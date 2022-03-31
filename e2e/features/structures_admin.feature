#language: fr

@admin_structures
Fonctionnalité: Parcours Administrateur de structures
	Pour pouvoir administrer mes structures
	En tant qu'administrateur de structures
	Je veux pouvoir gérer les structures qui me sont attribuées

	Scénario: Première connexion - Mise à jour profil
		Soit un utilisateur de type "admin_structure" authentifié avec l'email "jean.paul@drome.fr"
		Quand je vois "Création de mon compte Gestionnaire de structure"
		Alors je vois "jean" dans le champ "Prénom"
		Alors je vois "paul" dans le champ "Nom"
		Alors je vois "jean.paul@drome.fr" dans le champ "Courriel"
		Alors je vois "061234567, 091234567" dans le champ "Numéros de téléphone"
		Alors je clique sur "Créer mon compte"

	Scénario: Modifier plusieurs rattachements de bénéficiaires
		Soit un utilisateur de type "admin_structure" authentifié avec l'email "vincent.timaitre@beta.gouv.fr"
		Quand je vois "Groupe NS"
		Alors je clique sur "Groupe NS"
		Alors je vois "21" dans la tuile "Bénéficiaires non rattachés"
		Alors je clique sur "Bénéficiaires non rattachés"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Alors je selectionne l'option "Tous" dans la liste "Rattachement"
		Alors je clique sur "Sélectionner Katrina Beach"
		Alors je clique sur "Sélectionner Whitley Benjamin"
		Alors je vois "2 sélectionnés"
		Quand je clique sur "Rattacher"
		Alors je vois "Rattacher des bénéficiaires"
		Alors je selectionne l'option "Simon Anka" dans la liste "Nom du référent"
		Quand je clique sur "Rattacher" dans le volet
		Alors je vois "Simon Anka" sur la ligne "Beach"
		Alors je vois "Simon Anka" sur la ligne "Benjamin"

	Scénario: Définir le référent d'un bénéficiaire
		Soit un utilisateur de type "admin_structure" authentifié avec l'email "vincent.timaitre@beta.gouv.fr"
		Quand je vois "Groupe NS"
		Alors je clique sur "Groupe NS"
		Alors je vois "21" dans la tuile "Bénéficiaires non rattachés"
		Alors je clique sur "Bénéficiaires non rattachés"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Alors je selectionne l'option "Tous" dans la liste "Rattachement"
		Quand je recherche "Beach"
		Quand je clique sur "Rechercher"
		Alors je vois "Non rattaché" sur la ligne "Beach"
		Quand je clique sur "Non rattaché"
		Alors je vois "Rattacher des bénéficiaires"
		Alors je selectionne l'option "Simon Anka" dans la liste "Nom du référent"
		Quand je clique sur "Rattacher" dans le volet
		Alors je vois "Simon Anka" sur la ligne "Beach"
