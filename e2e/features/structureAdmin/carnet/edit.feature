#language: fr

Fonctionnalité: Mise à jour du carnet par un administrateur de structure
	En tant qu'administrateur de structure
	Je veux voir et mettre à jour les informations contact du bénéficiaire

	Scénario: Saisie des informations personnelles par l'administrateur de structure
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Alors je clique sur "Bénéficiaires non accompagnés"
		Alors j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je clique sur "Voir le carnet de Lindsay Aguilar"
		Quand je vais sur l'onglet suivant
		Alors j'attends que le texte "Lindsay Aguilar" apparaisse
		Alors je vois "Informations personnelles"
		Alors je vois "lindsay.aguilar@nisi.fr"
		Quand je clique sur "Mettre à jour les informations personnelles"
		Alors je vois qu'un élément avec l'id "peNumber" est désactivé
		Quand je renseigne "0601234566" dans le champ "Téléphone"
		Quand je clique sur "Enregistrer"
		Alors je vois "06 01 23 45 66"
