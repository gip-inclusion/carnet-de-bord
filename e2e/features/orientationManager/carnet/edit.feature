#language: fr

@orientation_manager_notebook_edit
Fonctionnalité: Mise à jour du carnet par un chargé d'orientation
	En tant que chargé d'orientaion assigné
	Je veux voir et mettre à jour les informations de sociopro du bénéficiaire

	Scénario: Saisie des informations personnelles par le chargé d'orientation
		Soit le "chargé d'orientation" assigné "giulia.diaby@cd93.fr" sur le carnet de "Tifour"
		Quand je clique sur "Mettre à jour" sous le titre "Informations personnelles"
		Alors je vois "Informations personnelles"
		Quand je renseigne "0601234567" dans le champ "Téléphone"
		Quand je clique sur "Enregistrer"
		Alors je vois "06 01 23 45 67"

	Scénario: Saisie des informations socio pro par le chargé d'orientation
		Soit le "chargé d'orientation" assigné "giulia.diaby@cd93.fr" sur le carnet de "Tifour"
		Quand je clique sur "Situation socioprofessionnelle"
		Quand je clique sur "Mettre à jour" sous le titre "Situation socioprofessionnelle"
		Alors je vois "Situation actuelle"
		Quand je renseigne la date "05/02/2020" dans le champ "Depuis le"
		Quand je clique sur le texte "12 mois"
		Quand je clique sur "Enregistrer"
		Alors je vois "du 05/02/2020 au 05/02/2021 - (environ 1 an)"
