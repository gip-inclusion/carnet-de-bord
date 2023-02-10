#language: fr

Fonctionnalité: Informations sur le bénéficaire
	Je veux voir et mettre à jour les informations du bénéficiaire

	Scénario: Saisie des informations personnelles par un pro
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
		Quand je clique sur "Mettre à jour" sous le titre "Informations personnelles"
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



	Scénario: Saisie des informations socioprofessionnelles par un pro
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
		Quand je clique sur "Mettre à jour" sous le titre "Diagnostic socioprofessionnel"
		Alors je vois "Situation actuelle"
		Quand je renseigne la date "20/06/2020" dans le champ "Depuis le"
		Quand je clique sur le texte "12 mois"
		Quand je renseigne la date "10/01/2020" dans le champ "Date de fin du dernier emploi"
		Quand je clique sur "Enregistrer"
		Alors je vois "Du 20/06/2020 au 20/06/2021 (12 mois)"
		Alors je vois "10/01/2020"


	Scénario: Saisie des informations socioprofessionnelles 2 ans
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
		Quand je clique sur "Mettre à jour" sous le titre "Diagnostic socioprofessionnel"
		Alors je vois "Situation actuelle"
		Quand je renseigne la date "20/06/2020" dans le champ "Depuis le"
		Quand je clique sur le texte "24 mois"
		Quand je clique sur "Enregistrer"
		Alors je vois "Du 20/06/2020 au 20/06/2022 (24 mois)"


	Scénario: Informations Pôle emploi
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Dorsey"
		Alors j'attends que le texte "Hendrix Dorsey" apparaisse
		Alors je clique sur "Se rattacher"
		Alors je vois "Bénéficiez-vous d'un mandat d'orientation en la qualité de référent ?"
		Alors je clique sur "Oui"
		Alors je clique sur "Se rattacher" dans la modale
		Alors je vois "Informations Pôle emploi"
		Alors je vois "30/04/2018"
		Alors je vois "RETOUR DIRECT EMPLOI"
		Alors je vois "ADAPT MARCHE TRAVAIL"
    Alors je vois "AUTRE MOTIF INSCRIPTION"
    Alors je vois "30/11/2020"
