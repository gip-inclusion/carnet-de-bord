#language: fr

Fonctionnalité: Demande de réorientation
	Pour pouvoir accompagner l'évolution du parcours d'un bénéficiaire
	En tant que référent
	Je veux pouvoir demander la réorientation d'un bénéficiaire

	Scénario: demande de réorientation
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
		Quand je clique sur "Demander une réorientation"
		Quand je renseigne "Réorientation requise" dans le champ "Motif de demande de réorientation"
		Quand je selectionne l'option "Social" dans la liste "Orientation recommandée"
		Quand je clique sur "Envoyer ma demande"
		Quand je clique sur le bouton "Envoyer ma demande"
		Alors je vois "Demande de réorientation envoyée"
		Alors je vois "Orientation recommandée : Social"

	Scénario: Affichage d'un bénéficiaire pour lequel la demande de réorientation a été refusée
		Soit le pro "pcamara@seinesaintdenis.fr" sur le carnet de "Rose"
		Alors je vois "Demande de réorientation refusée"
		Alors je vois "Orientation recommandée : Social"

	Scénario: Affichage d'un bénéficiaire pour lequel la demande de réorientation a été acceptée
		Soit le pro "pcamara@seinesaintdenis.fr" sur le carnet de "Herring"
		Alors je vois "Demande de réorientation acceptée"
		Alors je vois "Décision d'orientation : Social"

	Scénario: Affichage d'un bénéficiaire pour le précédent référent
		Soit le pro "sanka@groupe-ns.fr" sur le carnet de "Herring"
		Alors je vois "Demande de réorientation acceptée"
		Alors je vois "Décision d'orientation : Social"
