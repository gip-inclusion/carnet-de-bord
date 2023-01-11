#language: fr

Fonctionnalité: Rattachement à une structure
	Pour pouvoir gérer les réorientations
	En tant que manager d'un déploiement
	Je veux pouvoir assigner une nouvelle structure à un bénéficiaire

	Scénario: Modifier la structure de rattachement d'un bénéficiaire
		Soit un "administrateur de territoire" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Alors je vois "5"
		Quand je clique sur "Bénéficiaires"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Alors je vois "Centre Communal d'action social Livry-Gargan" sur la ligne "Aguilar"
		Quand je clique sur "Non rattaché"
		Alors je vois "Réorienter" dans le volet
		Alors je vois "Veuillez sélectionner l'orientation ainsi que la nouvelle structure et le nouveau référent." dans le volet
		Alors je selectionne l'option "Professionnel" dans la liste "Type d'orientation"
		Alors je selectionne l'option "AFPA (0)" dans la liste "Nom de la structure"
		Quand je clique sur "Valider"
		Alors je vois "AFPA" sur la ligne "Aguilar"
		Quand je clique sur "Accueil"
		Alors je vois "4"
