#language: fr

@manager_notebook_view
Fonctionnalité: Consultation d'un carnet par un manager
	En tant que manager
	Je veux voir le carnet d'un bénéficiaire

	Scénario: voir un carnet
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Alors j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je clique sur "Voir le carnet de Lindsay Aguilar"
		Quand je vais sur l'onglet suivant
		Alors j'attends que le texte "Lindsay Aguilar" apparaisse
		Alors je vois "lindsay.aguilar@nisi.fr"

	Scénario: voir l'information RQTH
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Alors j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je clique sur "Voir le carnet de Katharine Chandler"
		Quand je vais sur l'onglet suivant
		Alors j'attends que le texte "Katharine Chandler" apparaisse
		Quand je clique sur "Situation socioprofessionnelle"
		Alors je vois "Usager disposant de la RQTH"

	Scénario: Mettre à jour les informations personnelles
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Alors j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je clique sur "Voir le carnet de Payne Bennett"
		Quand je vais sur l'onglet suivant
		Alors j'attends que le texte "Payne Bennett" apparaisse
		Quand je clique sur "Mettre à jour" sous le titre "Informations personnelles"
		Quand je renseigne "Bennaytte" dans le champ "Prénom"
		Alors je vois "Informations personnelles"
		Quand je clique sur "Enregistrer"
		Alors je vois "Bennaytte"
