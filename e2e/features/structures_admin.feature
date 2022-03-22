#language: fr

@admin_structures
Fonctionnalité: Parcours Administrateur de structures
	Pour pouvoir administrer mes structures
	En tant qu'administrateur de structures
	Je veux pouvoir gérer les structures qui me sont attribuées

	Scénario: Première connexion - Mise à jour profil
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@beta.gouv.fr"
		Quand je vois "Création de mon compte Gestionnaire de structure"
		Alors je vois "Jacques" dans le champ "Prénom"
		Alors je vois "Célaire" dans le champ "Nom"
		Alors je vois "jacques.celaire@beta.gouv.fr" dans le champ "Courriel"
		Alors je vois "0102030405" dans le champ "Numéros de téléphone"
		Quand je clique sur "Créer mon compte"
		Alors je vois "Votre compte a été créé avec succès"

	Scénario: Import liste de professionnels
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@beta.gouv.fr"
		Alors je vois "Ma structure"
		Alors je vois "Saint Denis"
		Alors je vois "Centre Communal d'action social Livry-Gargan"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Alors je vois "Portefeuille de la structure"
		Quand je clique sur "Importer une liste de professionnels"
		Alors je vois "Importer des professionnels"
		Alors le lien "consulter la notice de remplissage" pointe sur "https://pad.incubateur.net/s/oQ_2Zj9jT#"
		Quand je télécharge en cliquant sur "télécharger un modèle"
		Alors j'ai téléchargé le fichier "import_professionnels.csv"
		Quand je téléverse le fichier "/resources/import_professionnels.csv"
		Alors je vois "Vous allez importer les professionnels suivants. Veuillez vérifier que les données sont correctes et confirmer."
		Alors je vois "2 professionnels sélectionnés sur 2"
		Quand je clique sur "Confirmer"
		Alors je vois "2 professionnels importés sur 2 demandés"


	Scénario: Import liste de rattachement
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@beta.gouv.fr"
		Soit un utilisateur sur la page "/structures/1c52e5ad-e0b9-48b9-a490-105a4effaaea"
		Alors je vois "Portefeuille de la structure"
		Quand je clique sur "Importer une liste de rattachement"
		Alors je vois "Rattacher des professionnels"
		Quand je télécharge en cliquant sur "télécharger la liste des bénéficiaires en attente de rattachement"
		Alors j'ai téléchargé le fichier "beneficiaires_en_attente.csv"
		Quand je téléverse le fichier "/resources/beneficiaires_en_attente.csv"
		Alors je vois "Vous allez importer le groupe de suivi suivant. Veuillez vérifier que les données sont correctes et confirmer."
		Alors je vois "1 rattachement sélectionné sur 1"
		Quand je clique sur "Confirmer"
		Alors je vois "1 rattachement importé sur 1 demandé."


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
