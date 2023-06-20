#language: fr

Fonctionnalité: Consultation d'un carnet par un gestionnaire de structure
	En tant que gestionnaire de structure
	Je veux voir le carnet d'un bénéficiaire

	Scénario: voir un carnet par un gestionnaire de structure
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Alors je clique sur "Bénéficiaires non accompagnés"
		Alors j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je clique sur "Voir le carnet de Lindsay Aguilar"
		Quand je vais sur l'onglet suivant
		Alors j'attends que le texte "Lindsay Aguilar" apparaisse
		Alors je vois "lindsay.aguilar@nisi.fr"
