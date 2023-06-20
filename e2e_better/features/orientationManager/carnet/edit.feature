#language: fr

Fonctionnalité: Mise à jour du carnet par un chargé d'orientation
	En tant que chargé d'orientaion assigné
	Je veux voir et mettre à jour les informations de sociopro du bénéficiaire

	Scénario: Saisie des informations personnelles par le chargé d'orientation
		Soit le chargé d'orientation assigné "giulia.diaby@cd93.fr" sur le carnet de "Tifour"
		Quand je clique sur "Mettre à jour les informations personnelles"
		Alors je vois "Informations personnelles"
		Quand je renseigne "0601234567" dans le champ "Téléphone"
		Quand je choisis "Droit ouvert et suspendu"
		Quand je choisis "ARE"
		Quand je décoche "ASS"
		Quand je choisis "Prime d'activité"
		Quand je clique sur "Enregistrer"
		Alors je vois "06 01 23 45 67"
		Alors je vois "RSA - Droit ouvert et suspendu"
		Alors je vois "ARE, Prime d'activité"

	Scénario: Saisie des informations socio pro par le chargé d'orientation
		Soit le chargé d'orientation assigné "giulia.diaby@cd93.fr" sur le carnet de "Tifour"
		Quand je clique sur "Mettre à jour le diagnostic socioprofessionnel"
		Alors je vois "Situation actuelle"
		Quand je renseigne la date "15/05/2020" dans le champ "Depuis le"
		Quand je clique sur le texte "12 mois"
		Quand je clique sur "Enregistrer"
		Alors je vois "Du 15/05/2020 au 15/05/2021 (12 mois)"
