#language: fr

Fonctionnalité: Gestion d'une demande de réorientation
	Pour pouvoir gérer une demande de réorientation
	En tant que chargé d'orientation
	Je veux pouvoir Réorienter ou Maintenir l'accompagnement d'un bénéficiaire

	Scénario: Maintenir l'accompagnement d'un bénéficiaire
		Soit le chargé d'orientation "giulia.diaby@cd93.fr" sur le carnet de "Bullock"
		Alors je vois "Demande de réorientation envoyée le 01/09/2022"
		Alors je vois "Orientation recommandée : Social"
		Quand je clique sur "Maintenir l'accompagnement"
		Alors je vois "Maintenir l'accompagnement" dans le volet
		Alors je vois "Êtes-vous sûr de vouloir maintenir l'accompagnement ?" dans le volet
		Quand je clique sur "Oui" dans le volet
		Alors je ne vois pas "Demande de réorientation envoyée le 01/09/2022"
		Alors je ne vois pas "Orientation recommandée : Social"

	Scénario: Maintenir l'accompagnement d'un bénéficiaire (Annuler)
		Soit le chargé d'orientation "giulia.diaby@cd93.fr" sur le carnet de "Bullock"
		Alors je vois "Demande de réorientation envoyée le 01/09/2022"
		Alors je vois "Orientation recommandée : Social"
		Quand je clique sur "Maintenir l'accompagnement"
		Alors je vois "Maintenir l'accompagnement" dans le volet
		Alors je vois "Êtes-vous sûr de vouloir maintenir l'accompagnement ?" dans le volet
		Quand je clique sur "Annuler" dans le volet
		Alors je vois "Demande de réorientation envoyée le 01/09/2022"
		Alors je vois "Orientation recommandée : Social"

	Scénario: Réorienter sans affecter un référent
		Soit le chargé d'orientation "giulia.diaby@cd93.fr" sur le carnet de "Bullock"
		Alors je vois "Demande de réorientation envoyée le 01/09/2022"
		Alors je vois "Orientation recommandée : Social"
		Quand je clique sur "Réorienter"
		Alors je vois "Réorienter" dans le volet
		Alors je vois "Veuillez sélectionner le dispositif d'accompagnement ainsi que la nouvelle structure et le nouveau référent." dans le volet
		Alors je sélectionne l'option "Professionnel" dans la liste "Dispositif d'accompagnement"
		Alors je sélectionne l'option "Pole Emploi Agence Livry-Gargnan (0)" dans la liste "Nom de la structure"
		Quand je clique sur "Valider" dans le volet
		Alors je ne vois pas "Demande de réorientation envoyée le 01/09/2022"
		Alors je ne vois pas "Orientation recommandée : Social"

	Scénario: Réorienter en affectant un référent
		Soit le chargé d'orientation "giulia.diaby@cd93.fr" sur le carnet de "Jennings"
		Alors je vois "Demande de réorientation envoyée le 01/09/2022"
		Alors je vois "Orientation recommandée : Social"
		Alors je vois "Orial"
		Alors je vois "Edith"
		Quand je clique sur "Réorienter"
		Alors je vois "Réorienter" dans le volet
		Alors je vois "Veuillez sélectionner le dispositif d'accompagnement ainsi que la nouvelle structure et le nouveau référent." dans le volet
		Alors je sélectionne l'option "Professionnel" dans la liste "Dispositif d'accompagnement"
		Alors je sélectionne l'option "Pole Emploi Agence Livry-Gargnan (0)" dans la liste "Nom de la structure"
		Alors je sélectionne l'option "Thierry Dunord (0)" dans la liste "Nom du référent"
		Quand je clique sur "Valider" dans le volet
		Alors je ne vois pas "Demande de réorientation envoyée le 01/09/2022"
		Alors je ne vois pas "Orientation recommandée : Social"
		Alors je vois "Dunord"
		Alors je vois "Thierry"
