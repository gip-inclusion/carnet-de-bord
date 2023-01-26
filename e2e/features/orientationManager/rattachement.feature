#language: fr

Fonctionnalité: Rattachement d'un pro par un chargé d'orientation
	Pour pouvoir gérer les orientation
	En tant que chargé d'orientation
	Je veux pouvoir assigner un référent aux bénéficiaires

	Scénario: Modifier le rattachement d'un bénéficiaire
		Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je selectionne l'option "Orienté" dans la liste "Statut"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Alors je vois "Pierre Chevalier" sur la ligne "Tifour"
		Quand je clique sur "Pierre Chevalier" dans la ligne de "Tifour"
		Alors je vois "Réorienter"
		Alors j'attends que le texte "Veuillez sélectionner l'orientation ainsi que la nouvelle structure et le nouveau référent" apparaisse
		Alors je selectionne l'option "Social" dans la liste "Type d'orientation"
		Alors je selectionne l'option "Groupe NS (0)" dans la liste "Nom de la structure"
		Alors je selectionne l'option "Simon Anka (0)" dans la liste "Nom du référent unique"
		Quand je clique sur "Valider"
		Alors je vois "Social" sur la ligne "Tifour"
		Alors je vois "Simon Anka" sur la ligne "Tifour"
		Alors je vois "Groupe NS" sur la ligne "Tifour"

	Scénario: Ré-orienter des bénéficiaires
		Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
 		Alors je choisis "Sélectionner Myrna Henderson"
		Alors je choisis "Sélectionner Della Lynch"
		Alors je vois "2 sélectionnés"
		Quand je clique sur "Rattacher"
		Alors je vois "Réorienter"
		Alors j'attends que le texte "Veuillez sélectionner l'orientation ainsi que la nouvelle structure et le nouveau référent" apparaisse
		Alors je selectionne l'option "Socio-professionnel" dans la liste "Type d'orientation"
		Alors je selectionne l'option "Service Social Départemental (2)" dans la liste "Nom de la structure"
		Quand je clique sur "Valider" dans le volet
		Alors je ne vois pas "Henderson"
		Alors je ne vois pas "Lynch"
		Quand je selectionne l'option "Orienté" dans la liste "Statut"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Alors je vois "Social" sur la ligne "Henderson"
		Alors je vois "Social" sur la ligne "Lynch"
		Alors je vois "Service Social Départemental" sur la ligne "Henderson"
		Alors je vois "Service Social Départemental" sur la ligne "Lynch"
