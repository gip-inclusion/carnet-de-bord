#language: fr

Fonctionnalité: Mise à jour du carnet par un administrateur de structure
	En tant qu'administrateur de structure
	Je veux voir et mettre à jour les informations contact du bénéficiaire

	Scénario: Saisie des informations personnelles par l'administrateur de structure
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Alors je clique sur "Bénéficiaires non accompagnés"
		Alors j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je clique sur "Voir le carnet de Lindsay AGUILAR"
		Quand je vais sur l'onglet suivant
		Alors j'attends que le texte "Lindsay AGUILAR" apparaisse
		Alors je vois "Informations personnelles"
		Alors je vois "lindsay.AGUILAR@nisi.fr"
		Quand je clique sur "Mettre à jour les informations personnelles"
		Alors je vois que le champ de formulaire "Revenu de solidarité active (RSA)" est désactivé
		Alors je vois que le champ de formulaire "Autres aides" est désactivé
		Alors je vois que le champ de formulaire "Identifiant Pôle emploi" est désactivé
		Alors je vois que le champ de formulaire "Identifiant CAF/MSA" est désactivé
		Quand je renseigne "0601234566" dans le champ "Téléphone"
		Quand je clique sur "Enregistrer"
		Alors je vois "06 01 23 45 66"
