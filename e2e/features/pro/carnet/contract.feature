#language: fr

@notebook_contract
Fonctionnalité: Information sur le contrat du bénéficiaire
	En tant que pro
	Je veux voir et mettre à jour les informations du contrat du bénéficiaire

Scénario: Saisie des informations du contrat
	Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
	Quand je clique sur "Axes de travail"
	Quand je clique sur le texte "Rattacher un contrat au carnet de bord"
	Quand je clique sur le texte "Contrat d'Engagement Réciproque (CER)"
	Alors je vois "Date de signature"
	Quand je renseigne "01/01/2020" dans le champ "Date de signature"
	Quand je renseigne "05/01/2020" dans le champ "Début du contrat"
	Quand je clique sur le texte "12 mois"
	Quand je clique sur "Enregistrer"
	Alors je vois "Du 05/01/2020 au 05/01/2021 - (environ 1 an)"
