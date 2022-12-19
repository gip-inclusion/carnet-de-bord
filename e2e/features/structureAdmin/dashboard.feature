#language: fr

Fonctionnalité: Voir les infos de ma structure
	Pour permettre aux professionnels de gérer leurs bénéficiaires
	En tant qu'administrateur de structures
	Je veux pouvoir rattacher les bénéficiaires de ma strucutre aux pro correspondants

	Scénario: Bénéficiaires accompagnés
		Soit un "administrateur de structures" authentifié avec l'email "lara.pafromage@cd93.fr"
		Quand je clique sur "Interlogement 93"
		Alors je vois "Portefeuille de la structure"
		Alors je vois "4" dans la tuile "Bénéficiaires accompagnés"
		Quand je clique sur "Bénéficiaires accompagnés"
		Alors je vois "ORIAL EDITH" sur la ligne "Bullock"
		Alors je vois "ORIAL EDITH" sur la ligne "Jennings"
		Alors je vois "ORIAL EDITH" sur la ligne "Lindsay"
		Alors je vois "ORIAL EDITH" sur la ligne "Valenzuela"

	Scénario: Bénéficiaires non rattachés
		Soit un "administrateur de structures" authentifié avec l'email "lara.pafromage@cd93.fr"
		Quand je clique sur "Interlogement 93"
		Alors je vois "Portefeuille de la structure"
		Alors je vois "2" dans la tuile "Bénéficiaires non rattachés"
		Quand je clique sur "Bénéficiaires non rattachés"
		Alors je vois "NON RATTACHÉ" sur la ligne "Gallegos"
		Alors je vois "NON RATTACHÉ" sur la ligne "Carlson"
