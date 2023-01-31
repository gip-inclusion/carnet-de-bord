#language: fr

Fonctionnalité: Accueil d'un chargé d'orientation
	Pour pouvoir avoir un vision de l'orientation sur mon territoire
	En tant que chargé d'orientation
	Je veux pouvoir les différents chiffres clés de mon territoire

	Scénario: Consultation des chiffres clefs
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand j'attends que le titre de page "Accueil" apparaisse
		Alors je vois "0" dans la tuile "Bénéficiaires accompagnés" sous le titre "Mon portefeuille"
		Alors je vois "8" dans la tuile "Bénéficiaires en attente de référent" sous le titre "Mon portefeuille"
		Alors je vois "0" dans la tuile "Bénéficiaires non accompagnés" sous le titre "Mon portefeuille"
		Alors je vois "0" dans la tuile "Demandes de réorientation" sous le titre "Mon portefeuille"
		Alors je vois "7" dans la tuile "Bénéficiaires accompagnés" sous le titre "Autres bénéficiaires de mon territoire"
		Alors je vois "39" dans la tuile "Bénéficiaires en attente de référent" sous le titre "Autres bénéficiaires de mon territoire"
		Alors je vois "2" dans la tuile "Bénéficiaires non accompagnés" sous le titre "Autres bénéficiaires de mon territoire"
		Alors je vois "5" dans la tuile "Demandes de réorientation" sous le titre "Autres bénéficiaires de mon territoire"
