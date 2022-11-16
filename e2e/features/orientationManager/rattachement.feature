#language: fr

Fonctionnalité: Rattachement d'un pro par un chargé d'orientation
	Pour pouvoir gérer les orientation
	En tant que chargé d'orientation
	Je veux pouvoir assigner un référent aux bénéficiaires

	Scénario: Modifier le rattachement d'un bénéficiaire
		Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je selectionne l'option "Orienté" dans la liste "Statut"
		Quand j'attends que le titre de page "Orientation des bénéficiaires" apparaisse
		Alors je vois "Pierre Chevalier" sur la ligne "Tifour"
		Quand je clique sur "Pierre Chevalier" dans la ligne de "Tifour"
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
		Quand je clique sur "Bénéficiaires"
		Quand j'attends que le titre de page "Orientation des bénéficiaires" apparaisse
 		Alors je choisis "Sélectionner Myrna Henderson"
		Alors je choisis "Sélectionner Della Lynch"
		Alors je vois "2 sélectionnés"
		Quand je clique sur "Rattacher"
		Alors je vois "Rattacher des bénéficiaires"
		Alors j'attends que le texte "Veuillez sélectionner la structure d'accueil" apparaisse
		Alors je selectionne l'option "Service Social Départemental" dans la liste "Nom de la structure"
		Quand je clique sur "Rattacher" dans le volet
		Alors je vois "Service Social Départemental" sur la ligne "Henderson"
		Alors je vois "Service Social Départemental" sur la ligne "Lynch"
