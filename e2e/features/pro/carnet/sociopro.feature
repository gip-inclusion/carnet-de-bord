#language: fr

Fonctionnalité: Informations sur la situation socioprofessionnelle
	En tant que pro
	Je veux voir et mettre à jour les informations de sociopro du bénéficiaire

	Scénario: Saisie des informations socioprofessionnelles
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
		Quand je clique sur "Mettre à jour" sous le titre "Diagnostic socioprofessionnel"
		Alors je vois "Situation actuelle"
		Quand je renseigne la date "20/06/2020" dans le champ "Depuis le"
		Quand je clique sur le texte "12 mois"
		Quand je clique sur "Enregistrer"
		Alors je vois "Du 20/06/2020 au 20/06/2021 (12 mois)"


	Scénario: Saisie des informations socioprofessionnelles 2 ans
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
		Quand je clique sur "Mettre à jour" sous le titre "Diagnostic socioprofessionnel"
		Alors je vois "Situation actuelle"
		Quand je renseigne la date "20/06/2020" dans le champ "Depuis le"
		Quand je clique sur le texte "24 mois"
		Quand je clique sur "Enregistrer"
		Alors je vois "Du 20/06/2020 au 20/06/2022 (24 mois)"
