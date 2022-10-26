#language: fr

Fonctionnalité: Rattachement à une structure
	Pour pouvoir gérer les réorientations
	En tant que manager d'un déploiement
	Je veux pouvoir assigner une nouvelle structure à un bénéficiaire

	Scénario: Modifier la structure de rattachement d'un bénéficiaire
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Alors je vois "6"
		Quand je clique sur "Bénéficiaires"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Alors je vois "Centre Communal d'action social Livry-Gargan" sur la ligne "Aguilar"
		Quand je clique sur "Non rattaché"
		Alors je vois "Rattacher des bénéficiaires"
		Alors j'attends que le texte "Veuillez sélectionner la structure d'accueil" apparaisse
		Alors je selectionne l'option "AFPA" dans la liste "Nom de la structure"
		Quand je clique sur "Rattacher"
		Alors je vois "AFPA" sur la ligne "Aguilar"
		Quand je clique sur "Accueil"
		Alors je vois "5"
