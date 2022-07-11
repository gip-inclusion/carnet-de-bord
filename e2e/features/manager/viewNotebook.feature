#language: fr

@manager_notebook_view
Fonctionnalité: Consultation d'un carnet par un manager
	En tant que maanger
	Je veux voir le carnet d'un bénéficiaire

	Scénario: voir un carnet
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Alors j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je clique sur "Voir le carnet de Lindsay Aguilar"
		Quand je vais sur l'onglet suivant
		Alors j'attends que le texte "Lindsay Aguilar" apparaisse
		Alors je vois "lindsay.aguilar@nisi.fr"
