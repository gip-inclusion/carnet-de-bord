#language: fr

Fonctionnalité: Import des chargés d'orientation
	Pour pouvoir ajouter de nouveaux chargés d'orientation à la plateforme
	En tant que manager d'un déploiement
	Je veux pouvoir importer une liste de chargés d'orientation

	Scénario: Import de chargés d'orientation
		Soit un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "Importer une liste de chargés d'orientation"
		Alors je vois "Importer des chargés d'orientation"
		Alors le lien "consulter la notice de remplissage" pointe sur "https://pad.incubateur.net/s/EchGdpy8h"
		Quand je télécharge en cliquant sur "télécharger un modèle"
		Alors j'ai téléchargé le fichier "import_charges_orientation.xlsx"
		Quand je téléverse le fichier "/resources/import_charges_orientation.xlsx"
		Quand j'attends que le texte "Récapitulatif des imports" apparaisse
		Alors je vois "2 chargés d'orientation importés sur 4."
		Alors je vois "Format d'adresse mail invalide" sur la ligne "Justine.titegoute"
		Alors je vois "Champ obligatoire manquant" sur la ligne "Porte SARAH"
