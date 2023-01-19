#language: fr

Fonctionnalité: Espace Administrateur de structure
	En tant qu'administrateur de structures
	Je veux pouvoir voir la liste des structures que j'administre

	Scénario: Voir le nombre de bénéficiaires accompagnés
		Soit un "administrateur de structures" authentifié avec l'email "lara.pafromage@cd93.fr"
		Alors je vois "29" dans la tuile "Centre Communal d'action social Livry-Gargan"
