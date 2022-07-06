#language: fr

@orientation_manager_rattachement_beneficiaire
Fonctionnalité: Rattachement d'un pro par un chargé d'orientation
	Pour pouvoir gérer les orientation
	En tant que chargé d'orientation
	Je veux pouvoir assigner un référent aux bénéficiaires

	Scénario: Modifier le rattachement d'un bénéficiaire
		Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
		Quand j'attends que le titre de page "Orientation des bénéficiaires" apparaisse
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
		Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
		Quand j'attends que le titre de page "Orientation des bénéficiaires" apparaisse
		Alors je clique sur "Sélectionner Corinne Cash"
		Alors je clique sur "Sélectionner Alexandria Cobb"
		Alors je vois "2 sélectionnés"
		Quand je clique sur "Rattacher"
		Alors je vois "Rattacher des bénéficiaires"
		Alors j'attends que le texte "Veuillez sélectionner la structure d'accueil" apparaisse
		Alors je selectionne l'option "Service Social Départemental" dans la liste "Nom de la structure"
		Quand je clique sur "Rattacher" dans le volet
		Alors je vois "Service Social Départemental" sur la ligne "Cash"
		Alors je vois "Service Social Départemental" sur la ligne "Cobb"
