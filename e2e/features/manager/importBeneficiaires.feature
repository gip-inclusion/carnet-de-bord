#language: fr

Fonctionnalité: Import de bénéficiaires
	Pour pouvoir ajouter de nouveaux bénéficiaires à la plateforme
	En tant que manager d'un déploiement
	Je veux pouvoir importer une liste de bénéficiaires

	Scénario: Import de bénéficiaires
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Importer des bénéficiaires"
		Quand je clique sur "Importer des nouveaux bénéficiaires"
		Alors le lien "consulter la notice de remplissage" pointe sur "https://pad.incubateur.net/s/nLmDl89Oi#"
		Quand je télécharge en cliquant sur "télécharger un modèle"
		Alors j'ai téléchargé le fichier "import_beneficiaires.csv"
		Quand je téléverse le fichier "/resources/import_beneficiaires.csv"
		Alors je vois "Vous allez importer les bénéficiaires suivants. Veuillez vérifier que les données sont correctes et confirmer."
		Alors je vois "4 bénéficiaires sélectionnés sur 4"
		Quand je clique sur "Confirmer"
		Alors je vois "2 bénéficiaires importés sur 4 demandés."
		Alors je vois "Un bénéficiaire existe déjà avec cet identifiant SI sur le territoire." sur la ligne "Charlotte"
		Alors je vois "Un bénéficiaire existe déjà avec ce nom/prénom/date de naissance sur le territoire." sur la ligne "charlie"

	Scénario: Import de bénéficiaires avec différents formats de date
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Importer des bénéficiaires"
		Quand je clique sur "Importer des nouveaux bénéficiaires"
		Quand je téléverse le fichier "/resources/import_beneficiaires_with_all_date_formats.csv"
		Alors je vois "Vous allez importer les bénéficiaires suivants. Veuillez vérifier que les données sont correctes et confirmer."
		Alors je vois "4 bénéficiaires sélectionnés sur 4"
		Alors je ne vois pas d'alerte

	Scénario: Import de bénéficiaires avec un fichier partiel (identifiant, nom, prenom, date de naissance et nir)
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Importer des bénéficiaires"
		Quand je clique sur "Importer des nouveaux bénéficiaires"
 		Quand je téléverse le fichier "/resources/import_beneficiaires_partial.csv"
		Alors je vois "Vous allez importer les bénéficiaires suivants. Veuillez vérifier que les données sont correctes et confirmer."
		Alors je vois "2 bénéficiaires sélectionnés sur 4"
		Quand je clique sur "Confirmer"
		Alors je vois "2 bénéficiaires importés sur 2 demandés."

	Scénario: Ré-Import de bénéficiaires
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Importer des bénéficiaires"
		Quand je clique sur "Importer des nouveaux bénéficiaires"
		Quand je téléverse le fichier "/resources/re_import_beneficiaires.csv"
		Alors je vois "Vous allez importer les bénéficiaires suivants. Veuillez vérifier que les données sont correctes et confirmer."
		Alors je vois "2 bénéficiaires sélectionnés sur 2"
		Quand je clique sur "Confirmer"
		Alors je vois "1 bénéficiaire importé"
		Alors je vois "1 bénéficiaire mis à jour"


	Scénario: Import de nouveaux bénéficiaires
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Importer des bénéficiaires"
		Quand je clique sur "Importer des nouveaux bénéficiaires"
 		Quand je téléverse le fichier "/resources/import_beneficiaires.csv"
		Quand je clique sur "Confirmer"
		Quand je clique sur "Fermer"
		Quand je clique sur "Bénéficiaires"
		Quand j'attends que la table "Liste des bénéficiaires" apparaisse
		Alors je recherche "fon"
		Quand je clique sur "Rechercher"
		Alors je vois "à orienter" sur la ligne "Fondue"
