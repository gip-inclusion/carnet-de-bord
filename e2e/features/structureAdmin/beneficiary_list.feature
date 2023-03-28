#language: fr

Fonctionnalité: Liste des bénéficiaires
	Pour permettre aux administrateur de structure de gérer les bénéficiaires accompagnés par leur structure
	En tant qu'administrateur de structure
	Je veux pouvoir filter les bénéficiaires de ma structure

	Scénario: Voir tout les bénéficiaires
		Soit un "administrateur de structures" authentifié avec l'email "lara.pafromage@cd93.fr"
		Alors je clique sur "Interlogement 93"
		Alors je vois "2" dans la tuile "Bénéficiaires non accompagnés"
		Alors je vois "4" dans la tuile "Bénéficiaires accompagnés"
		Alors je clique sur "Bénéficiaires non accompagnés"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Alors je sélectionne l'option "Tous" dans la liste "Rattachement"
		Alors je vois 6 lignes dans le tableau "Liste des bénéficiaires"
