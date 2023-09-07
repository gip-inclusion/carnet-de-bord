#language: fr

Fonctionnalité: Information sur le contrat du bénéficiaire
	En tant que pro
	Je veux voir et mettre à jour les informations du contrat du bénéficiaire

Scénario: Saisie des informations du contrat
	Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "TIFOUR"
	Quand je clique sur le texte "Rattacher un contrat au carnet de bord"
	Quand je clique sur le texte "Contrat d'Engagement Réciproque (CER)"
	Alors je vois "Date de signature"
	Quand je renseigne la date "15/05/2020" dans le champ "Date de signature"
	Quand je renseigne la date "20/05/2020" dans le champ "Début du contrat"
	Quand je clique sur le texte "12 mois"
	Quand je clique sur "Enregistrer"
	Alors je vois "Depuis le 20/05/2020 jusqu'au 20/05/2021 - (environ 1 an)"

Scénario: Saisie des informations du contrat 2 ans
	Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "TIFOUR"
	Quand je clique sur le texte "Rattacher un contrat au carnet de bord"
	Quand je clique sur le texte "Contrat d'Engagement Réciproque (CER)"
	Alors je vois "Date de signature"
	Quand je renseigne la date "15/05/2020" dans le champ "Date de signature"
	Quand je renseigne la date "20/05/2020" dans le champ "Début du contrat"
	Quand je clique sur le texte "24 mois"
	Quand je clique sur "Enregistrer"
	Alors je vois "Depuis le 20/05/2020 jusqu'au 20/05/2022 - (environ 2 ans)"

Scénario: Saisie des informations du contrat (durée indéterminée)
	Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "TIFOUR"
	Quand je clique sur le texte "Rattacher un contrat au carnet de bord"
	Quand je clique sur le texte "Contrat d'Engagement Réciproque (CER)"
	Alors je vois "Date de signature"
	Quand je renseigne la date "15/05/2020" dans le champ "Date de signature"
	Quand je renseigne la date "20/05/2020" dans le champ "Début du contrat"
	Quand je clique sur le texte "indéterminée"
	Quand je clique sur "Enregistrer"
	Alors je vois "Depuis le 20/05/2020 - (durée indéterminée)"
