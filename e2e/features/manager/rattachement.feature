#language: fr

@modifier_rattachement_beneficiaire
Fonctionnalité: Rattachement pro
	Pour pouvoir gérer les réorientation
	En tant que manager d'un déploiement
	Je veux pouvoir assigner de nouveaux référents aux bénéficiaires

	Scénario: Modifier le rattachement d'un bénéficiaire
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je recherche "tif"
		Quand je clique sur "Rechercher"
		Alors je vois "Pierre Chevalier" sur la ligne "Tifour"
		Quand je clique sur "Pierre Chevalier"
		Alors je vois "Rattacher des bénéficiaires"
		Alors j'attends que le texte "Veuillez sélectionner la structure d'accueil" apparaisse
		Alors je selectionne l'option "Groupe NS" dans la liste "Nom de la structure"
		Alors je selectionne l'option "Simon Anka" dans la liste "Nom du nouveau référent unique"
		Alors je choisis "Retirer l'ancien référent du groupe de suivi."
		Quand je clique sur "Rattacher"
		Alors je vois "Simon Anka" sur la ligne "Tifour"
		Alors je vois "Groupe NS" sur la ligne "Tifour"

	Scénario: Ré-orienter des bénéficiaires
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Alors je choisis "Sélectionner Corinne Cash"
		Alors je choisis "Sélectionner Alexandria Cobb"
		Alors je vois "2 sélectionnés"
		Quand je clique sur "Rattacher"
		Alors je vois "Rattacher des bénéficiaires"
		Alors j'attends que le texte "Veuillez sélectionner la structure d'accueil" apparaisse
		Alors je selectionne l'option "Service Social Départemental" dans la liste "Nom de la structure"
		Quand je clique sur "Rattacher" dans le volet
		Alors je vois "Non rattaché" sur la ligne "Cash"
		Alors je vois "Service Social Départemental" sur la ligne "Cash"
		Alors je vois "Non rattaché" sur la ligne "Cobb"
		Alors je vois "Service Social Départemental" sur la ligne "Cobb"
