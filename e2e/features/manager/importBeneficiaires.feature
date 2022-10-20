#language: fr

Fonctionnalité: Import de bénéficiaires
	Pour pouvoir ajouter de nouveaux bénéficiaires à la plateforme
	En tant que manager d'un déploiement
	Je veux pouvoir importer une liste de bénéficiaires

	Scénario: Import de bénéficiaires
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Importer des bénéficiaires"
		Alors je vois "Importer des bénéficiaires"
		Alors le lien "consulter la notice de remplissage" pointe sur "https://pad.incubateur.net/s/nLmDl89Oi#"
		Quand je télécharge en cliquant sur "télécharger un modèle"
		Alors j'ai téléchargé le fichier "import_beneficiaires.csv"
		Quand je téléverse le fichier "/resources/import_beneficiaires.csv"
		Alors je vois "Vous allez importer les bénéficiaires suivants. Veuillez vérifier que les données sont correctes et confirmer."
		Alors je vois "4 bénéficiaires sélectionnés sur 4"
		Quand je clique sur "Confirmer"
		Alors je vois "3 bénéficiaires importés sur 4 demandés."
		Alors je vois "Un bénéficiaire existant utilise cet internalId ou ce nom/prénom/date de naissance sur le territoire." sur la ligne "charlie"

	Scénario: Import de bénéficiaires avec différents formats de date
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Importer des bénéficiaires"
		Alors je vois "Importer des bénéficiaires"
		Quand je téléverse le fichier "/resources/import_beneficiaires_with_all_date_formats.csv"
		Alors je vois "Vous allez importer les bénéficiaires suivants. Veuillez vérifier que les données sont correctes et confirmer."
		Alors je vois "4 bénéficiaires sélectionnés sur 4"
		Alors je ne vois pas d'alerte
