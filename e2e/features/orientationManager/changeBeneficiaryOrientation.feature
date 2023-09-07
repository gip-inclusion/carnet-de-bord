#language: fr

Fonctionnalité: Changer le dispositif d'accompagnement d'un bénéficiaire
	Pour pouvoir orienter ou réorienter un bénéficiaire
	En tant que chargé d'orientation
	Je veux pouvoir changer le dispositif d'accompagnement et le rattachement d'un bénéficiaire

	Scénario: Orienter un bénéficiaire
		Soit le chargé d'orientation assigné "giulia.diaby@cd93.fr" sur le carnet de "Hoffman"
		Quand je clique sur "Orienter"
		Alors je vois "Orienter" dans le volet
		Alors je vois "Veuillez sélectionner le dispositif d'accompagnement ainsi que la nouvelle structure et le nouveau référent." dans le volet
		Alors je sélectionne l'option "Professionnel" dans la liste "Dispositif d'accompagnement"
		Alors je sélectionne l'option "Pole Emploi Agence Livry-Gargnan (0)" dans la liste "Nom de la structure"
		Alors je sélectionne l'option "Thierry DUNORD (0)" dans la liste "Nom du référent"
		Quand je clique sur "Valider" dans le volet "Orienter"
		Alors je ne vois pas "Orienter"
		Alors je vois "Réorienter"
		Alors je vois "Référent Professionnel" sur la ligne "Thierry DUNORD"
		Alors je vois "Pole Emploi Agence Livry-Gargnan" sur la ligne "Thierry DUNORD"

	Scénario: Réorienter un bénéficiaire
		Soit le chargé d'orientation assigné "giulia.diaby@cd93.fr" sur le carnet de "TIFOUR"
		Quand je clique sur "Réorienter"
		Alors je vois "Réorienter" dans le volet
		Alors je vois "Veuillez sélectionner le dispositif d'accompagnement ainsi que la nouvelle structure et le nouveau référent." dans le volet
		Alors je sélectionne l'option "Professionnel" dans la liste "Dispositif d'accompagnement"
		Alors je sélectionne l'option "Pole Emploi Agence Livry-Gargnan (0)" dans la liste "Nom de la structure"
		Alors je sélectionne l'option "Thierry DUNORD (0)" dans la liste "Nom du référent"
		Quand je clique sur "Valider" dans le volet "Réorienter"
		Alors je ne vois pas "Orienter"
		Alors je vois "Réorienter"
		Alors je vois "Thierry DUNORD"
		Alors je vois "Référent Professionnel" sur la ligne "Thierry DUNORD"
		Alors je vois "Pole Emploi Agence Livry-Gargnan" sur la ligne "Thierry DUNORD"
