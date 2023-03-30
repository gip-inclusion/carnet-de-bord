#language: fr

Fonctionnalité: Rattachement liste de bénéficiaires
	Pour permettre aux professionnels de gérer leurs bénéficiaires
	En tant qu'administrateur de structure
	Je veux pouvoir rattacher les bénéficiaires de ma structure aux pro correspondants

	Scénario: Import liste de rattachement
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
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
		Soit un "administrateur de structures" authentifié avec l'email "vincent.timaitre@groupe-ns.fr"
		Quand je vois "Groupe NS"
		Alors je clique sur "Groupe NS"
		Alors je vois "17" dans la tuile "Bénéficiaires non accompagnés"
		Alors je clique sur "Bénéficiaires non accompagnés"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Alors je sélectionne l'option "Tous" dans la liste "Rattachement"
		Alors je choisis "Sélectionner Katrina Beach"
		Alors je choisis "Sélectionner Whitley Benjamin"
		Alors je vois "2 sélectionnés"
		Quand je clique sur "Rattacher"
		Alors je vois "Rattacher"
		Alors j'attends que le texte "Veuillez sélectionner le nouveau référent unique des bénéficiaires." apparaisse
		Alors je sélectionne l'option "Simon Anka" dans la liste "Nom du référent"
		Quand je clique sur "Rattacher" dans le volet
		Alors je vois "Simon Anka" sur la ligne "Beach"
		Alors je vois "Simon Anka" sur la ligne "Benjamin"

	Scénario: Définir le référent d'un bénéficiaire
		Soit un "administrateur de structures" authentifié avec l'email "vincent.timaitre@groupe-ns.fr"
		Quand je vois "Groupe NS"
		Alors je clique sur "Groupe NS"
		Alors je vois "17" dans la tuile "Bénéficiaires non accompagnés"
		Alors je clique sur "Bénéficiaires non accompagnés"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Alors je sélectionne l'option "Tous" dans la liste "Rattachement"
		Quand je recherche "Beach"
		Quand je clique sur "Rechercher"
		Alors je vois "Non rattaché" sur la ligne "Beach"
		Quand je clique sur "Non rattaché"
		Alors je vois "Rattacher"
		Alors j'attends que le texte "Veuillez sélectionner le nouveau référent unique du bénéficiaire." apparaisse
		Alors je sélectionne l'option "Simon Anka" dans la liste "Nom du référent"
		Quand je clique sur "Rattacher" dans le volet
		Alors je vois "Simon Anka" sur la ligne "Beach"
