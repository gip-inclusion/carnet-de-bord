#language: fr

Fonctionnalité: Demande de réorientation
	En tant que référent
	Pour pouvoir accompagner l'évolution du parcours d'un bénéficiaire
	Je veux pouvoir demander la réorientation d'un bénéficiaire

	Scénario: demande de réorientation
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
		Quand je clique sur "Demander une réorientation"
		Quand je renseigne "Réorientation requise" dans le champ "Motif de demande de réorientation"
		Quand je sélectionne l'option "Social" dans la liste "Orientation recommandée"
		Quand je clique sur "Envoyer ma demande"
		Quand je clique sur le bouton "Envoyer ma demande"
		Alors je vois "Demande de réorientation envoyée"
		Alors je vois "Orientation recommandée : Social"
		Alors je ne vois pas "Demander une réorientation"

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

	Scénario: Non affichage du motif de l'orientation quand une demande est en cours
		Soit le pro "edith.orial@interlogement93.fr" sur le carnet de "Jennings"
		Alors je vois "Demande de réorientation envoyée le"
		Alors je ne vois pas "Voir le motif d‘orientation"

	Scénario: Affichage du motif de l'orientation
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
		Quand je clique sur "Voir le motif de l‘orientation"
		Alors je vois "Pierre Chevalier est sans aucun doute le meilleur référent pour ce bénéficiaire."

	Scénario: Affichage du motif de maintien de l'orientation
		Soit le pro "pcamara@seinesaintdenis.fr" sur le carnet de "Rose"
		Quand je clique sur "Voir le motif du maintien d'accompagnement"
		Alors je vois "Maintien de l'accompagnement"
		Alors je vois "03/09/2022"
		Alors je vois "SOCIAL"
		Alors je vois "Demande d'orientation refusée car l'accompagnateur continue son accompagnement."
