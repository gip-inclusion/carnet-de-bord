#language: fr

Fonctionnalité: Changer l'orientation d'un bénéficiaire
	Pour pouvoir orienter ou réorienter un bénéficiaire
	En tant que chargé d'orientation
	Je veux pouvoir changer l'orientation et le rattachement d'un bénéficiaire

	Scénario: Orienter un bénéficiaire
		Soit le chargé d'orientation assigné "giulia.diaby@cd93.fr" sur le carnet de "Lynch"
		Quand je clique sur "Orienter"
		Alors je vois "Orienter" dans le volet
		Alors je vois "Veuillez sélectionner l'orientation ansi que la nouvelle structure et le nouveau référent." dans le volet
		Alors je selectionne l'option "Professionnel" dans la liste "Type d'orientation"
		Alors je selectionne l'option "Pole Emploi Agence Livry-Gargnan" dans la liste "Nom de la structure"
		Alors je selectionne l'option "Thierry Dunord" dans la liste "Nom du référent"
		Quand je clique sur "Valider" dans le volet
		Alors je ne vois pas "Orienter"
		Alors je vois "Réorienter"
		Alors je vois "Thierry Dunord"
		Alors je vois "(Pole Emploi Agence Livry-Gargnan)"

	Scénario: Réorienter un bénéficiaire
		Soit le chargé d'orientation assigné "giulia.diaby@cd93.fr" sur le carnet de "Tifour"
		Quand je clique sur "Réorienter"
		Alors je vois "Réorienter" dans le volet
		Alors je vois "Veuillez sélectionner l'orientation ansi que la nouvelle structure et le nouveau référent." dans le volet
		Alors je selectionne l'option "Professionnel" dans la liste "Type d'orientation"
		Alors je selectionne l'option "Pole Emploi Agence Livry-Gargnan" dans la liste "Nom de la structure"
		Alors je selectionne l'option "Thierry Dunord" dans la liste "Nom du référent"
		Quand je clique sur "Valider" dans le volet
		Alors je ne vois pas "Orienter"
		Alors je vois "Réorienter"
		Alors je vois "Thierry Dunord"
		Alors je vois "(Pole Emploi Agence Livry-Gargnan)"
