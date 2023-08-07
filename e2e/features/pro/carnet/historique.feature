#language: fr

Fonctionnalité: Historique de parcours

	Scénario: Les nouvelles actions sont affichées automatiquement
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
		Quand je clique sur "Logement" dans la tuile "Logement"
		Quand je clique sur "Changer de logement"
		Alors je vois "Sélectionner une action"
		Quand je clique sur "Sélectionner une action"
		Quand je renseigne "Atelier cv" dans le champ "Rechercher une action"
		Quand je clique sur la suggestion "Atelier CV"
		Quand je clique sur "Ajouter"
		Alors je vois "Atelier CV"
		Quand je ferme le volet
		Alors je vois "Atelier CV" dans le tableau "Historique de parcours"
