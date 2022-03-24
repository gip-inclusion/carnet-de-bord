#language: fr

@manager
Fonctionnalité: Rattachement pro
	Pour pouvoir gérer les réorientation
	En tant que manager d'un déploiement
	Je veux pouvoir assigner de nouveaux référents aux bénéficiaires

	Scénario: Modifier le rattachement d'un bénéficiaire
		Soit un utilisateur de type "manager" authentifié avec l'email "support.carnet-de-bord@fabrique.social.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Alors je vois "Sophie"
		Alors je vois "Tifour"
		Alors je vois "Pierre Chevalier"
		Quand je clique sur "Pierre Chevalier"
		Alors je vois "Rattacher des bénéficiaires"
		Alors je selectionne l'option "Sandie Manchet" dans la liste "Nom du nouveau professionnel"
		Alors je choisis "Retirer les anciens accompagnateurs du groupe de suivi."
		Quand je clique sur "Rattacher"
		Alors je vois "Sandie Manchet"
