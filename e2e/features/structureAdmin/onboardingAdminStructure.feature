#language: fr

@onboarding_admin_structure
Fonctionnalité: Onboarding administrateur de structure
	Pour pouvoir finaliser la création de mon compte
	En tant qu'administrateur de structure
	Je veux pouvoir saisir et valider mes informations personnelles

	Scénario: Première connexion - Mise à jour profil
		Soit un "administrateur de structures" authentifié pour la première fois avec l'email "jacques.celaire@beta.gouv.fr"
		Quand je vois "Création de mon compte Gestionnaire de structure"
		Alors je vois "Jacques" dans le champ "Prénom"
		Alors je vois "Célaire" dans le champ "Nom"
		Alors je vois "jacques.celaire@beta.gouv.fr" dans le champ "Courriel"
		Alors je vois "0102030405" dans le champ "Numéros de téléphone"
		Quand je clique sur "Créer mon compte"
		Alors je vois "Votre compte a été créé avec succès"

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
