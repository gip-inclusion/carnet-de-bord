#language: fr

Fonctionnalité: Rattachement pro
	Pour pouvoir gérer les réorientations
	En tant que manager d'un déploiement
	Je veux pouvoir assigner de nouveaux référents aux bénéficiaires

	Scénario: Modifier le rattachement d'un bénéficiaire
		Soit un "administrateur de territoire" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je recherche "tif"
		Quand je clique sur "Rechercher"
		Alors je vois "Pierre Chevalier" sur la ligne "Tifour"
		Quand je clique sur "Pierre Chevalier"
		Alors je vois "Réorienter" dans le volet
		Alors je vois "Veuillez sélectionner l'orientation ainsi que la nouvelle structure et le nouveau référent." dans le volet
		Alors je selectionne l'option "Pro" dans la liste "Type d'orientation"
		Alors je selectionne l'option "Groupe NS (0)" dans la liste "Nom de la structure"
		Alors je selectionne l'option "Simon Anka (0)" dans la liste "Nom du référent"
		Quand je clique sur "Valider" dans le volet
		Alors je vois "Simon Anka" sur la ligne "Tifour"
		Alors je vois "Groupe NS" sur la ligne "Tifour"

	Scénario: Ré-orienter des bénéficiaires
		Soit un "administrateur de territoire" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Alors je choisis "Sélectionner Corinne Cash"
		Alors je choisis "Sélectionner Alexandria Cobb"
		Alors je vois "2 sélectionnés"
		Quand je clique sur "Rattacher"
		Alors je vois "Réorienter" dans le volet
		Alors je vois "Veuillez sélectionner l'orientation ainsi que la nouvelle structure et le nouveau référent." dans le volet
		Alors je selectionne l'option "Socio-pro" dans la liste "Type d'orientation"
		Alors je selectionne l'option "Service Social Départemental (2)" dans la liste "Nom de la structure"
		Quand je clique sur "Valider" dans le volet
		Alors je vois "Non rattaché" sur la ligne "Cash"
		Alors je vois "Service Social Départemental" sur la ligne "Cash"
		Alors je vois "Non rattaché" sur la ligne "Cobb"
		Alors je vois "Service Social Départemental" sur la ligne "Cobb"
