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
		Alors je vois "Orial EDITH" sur la ligne "BULLOCK Etta"
		Alors je vois "Orial EDITH" sur la ligne "JENNINGS Dee"
		Alors je vois "Orial EDITH" sur la ligne "AGUILAR Lindsay"
		Alors je vois "Orial EDITH" sur la ligne "VALENZUELA Maricela"

	Scénario: Bénéficiaires non accompagnés
		Soit un "administrateur de structures" authentifié avec l'email "lara.pafromage@cd93.fr"
		Quand je clique sur "Interlogement 93"
		Alors je vois "Portefeuille de la structure"
		Alors je vois "2" dans la tuile "Bénéficiaires non accompagnés"
		Quand je clique sur "Bénéficiaires non accompagnés"
		Alors je vois "Non rattaché" sur la ligne "GALLEGOS Winnie"
		Alors je vois "Non rattaché" sur la ligne "CARLSON Oconnor"
