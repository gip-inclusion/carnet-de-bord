#language: fr

@notebook_contract
Fonctionnalité: Informations sur la situation socioprofessionnelle
	En tant que pro
	Je veux voir et mettre à jour les informations de sociopro du bénéficiaire

	Scénario: Saisie des informations socioprofessionnelles
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
		Quand je clique sur "Situation socioprofessionnelle"
		Quand je clique sur "Mettre à jour" sous le titre "Situation socioprofessionnelle"
		Alors je vois "Situation actuelle"
		Quand je renseigne "01/01/2020" dans le champ "Depuis le"
		Quand je clique sur le texte "12 mois"
		Quand je clique sur "Enregistrer"
		Alors je vois "du 01/01/2020 au 01/01/2021 - (environ 1 an)"
