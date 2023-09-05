#language: fr

Fonctionnalité: Consultation d'un carnet par un manager
	En tant que manager
	Je veux voir le carnet d'un bénéficiaire

	Scénario: voir un carnet par un manager
		Soit un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Alors j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je clique sur "Voir le carnet de Lindsay AGUILAR"
		Quand je vais sur l'onglet suivant
		Alors j'attends que le texte "Lindsay AGUILAR" apparaisse
		Alors je vois "lindsay.AGUILAR@nisi.fr"

	Scénario: voir l'information RQTH
		Soit un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Alors j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je clique sur "Voir le carnet de Katharine Chandler"
		Quand je vais sur l'onglet suivant
		Alors j'attends que le texte "Katharine Chandler" apparaisse
		Alors je vois "Dispose d'une RQTH"
		Alors je vois "Oui"

	Scénario: Mettre à jour les informations personnelles
		Soit un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Alors j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je clique sur "Voir le carnet de Payne Bennett"
		Quand je vais sur l'onglet suivant
		Alors j'attends que le texte "Payne Bennett" apparaisse
		Quand je clique sur "Mettre à jour les informations personnelles"
		Quand je renseigne "Bennaytte" dans le champ "Prénom"
		Alors je vois "Informations personnelles"
		Quand je clique sur "Enregistrer"
		Alors je vois "Bennaytte"
