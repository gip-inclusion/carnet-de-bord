#language: fr

Fonctionnalité: Import structures
	Pour pouvoir ajouter de nouvelles structures à la plateforme
	En tant que manager d'un déploiement
	Je veux pouvoir importer une liste de structures

	Scénario: Import de structures
		Soit un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Alors je vois "État du territoire"
		Quand je clique sur "Importer des structures"
		Alors je vois "Importer des structures"
		Alors le lien "consulter la notice de remplissage" pointe sur "https://pad.incubateur.net/s/y-ZW1qQOw#"
		Quand je télécharge en cliquant sur "télécharger un modèle"
		Alors j'ai téléchargé le fichier "import_structures.csv"
		Quand je téléverse le fichier "/resources/import_structures.csv"
		Alors je vois "Vous allez importer les structures suivantes. Veuillez vérifier que les données sont correctes et confirmer."
		Alors je vois "2 structures sélectionnées sur 2"
		Quand je clique sur "Confirmer"
		Alors je vois "2 structures importées sur 2."
