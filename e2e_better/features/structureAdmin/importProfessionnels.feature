#language: fr

Fonctionnalité: Import de professionnels
	Pour pouvoir inviter des professionnels sur CdB
	En tant qu'administrateur de structures
	Je veux pouvoir importer une liste de professionnels au format CSV

	Scénario: Import liste de professionnels
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
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
