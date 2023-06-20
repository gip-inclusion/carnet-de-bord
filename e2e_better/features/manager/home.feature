#language: fr

Fonctionnalité: Tableau de bord du manager
	Pour pouvoir gérer l'état du territoire
	En tant que manager d'un déploiement
	Je veux pouvoir consulter les chiffres clés du déploiement

	Scénario: Affichage des tuiles
		Soit un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Alors je vois "56" dans la tuile "Bénéficiaires sur le territoire"
 		Alors je vois "2" dans la tuile "Bénéficiaires non accompagné"
		Alors je vois "9" dans la tuile "Structures sur le territoire"
		Alors je vois "5" dans la tuile "Structures sans bénéficiaire"
