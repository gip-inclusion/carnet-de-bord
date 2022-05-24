#language: fr

@import_beneficiaires
Fonctionnalité: Import de bénéficiaires
	Pour pouvoir ajouter de nouveaux bénéficiaires à la plateforme
	En tant que manager d'un déploiement
	Je veux pouvoir importer une liste de bénéficiaires

	Scénario: Import de bénéficiaires
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord@fabrique.social.gouv.fr"
		Quand je clique sur "Importer des bénéficiaires"
		Alors je vois "Importer des bénéficiaires"
		Alors le lien "consulter la notice de remplissage" pointe sur "https://pad.incubateur.net/s/VSXZgm8fy#"
		Quand je télécharge en cliquant sur "télécharger un modèle"
		Alors j'ai téléchargé le fichier "import_beneficiaires.csv"
		Quand je téléverse le fichier "/resources/import_beneficiaires.csv"
		Alors je vois "Vous allez importer les bénéficiaires suivants. Veuillez vérifier que les données sont correctes et confirmer."
		Alors je vois "2 bénéficiaires sélectionnés sur 2"
		Quand je clique sur "Confirmer"
		Alors je vois "2 bénéficiaires importés sur 2 demandés."
		Quand je clique sur "Fermer"
		Quand je clique sur "Bénéficiaires"
		Quand je recherche "Fondue"
		Quand je clique sur "Rechercher"
		Alors je vois "Oui" sur la ligne "Charlotte"
		Alors je vois "Non" sur la ligne "Charlie"
