#language: fr

Fonctionnalité: Assignation d'un chargé d'orientation
	Pour pouvoir gérer les orientation
	En tant que chargé d'orientation
	Je veux pouvoir assigner un chargé d'orientation à un bénéficiaire

	Scénario: Modifier le chargé d'orientation d'un bénéficiaire
		Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je sélectionne l'option "Autres bénéficiaires du territoire" dans la liste "Bénéficiaires"
		Quand je clique sur "Non assigné" dans la ligne de "Conley"
		Alors je vois "Assigner un chargé d'orientation"
		Alors j'attends que le texte "Veuillez sélectionner le chargé d'orientation" apparaisse
		Alors je sélectionne l'option "Giulia Diaby" dans la liste "Nom du chargé d’orientation"
		Quand je clique sur "Assigner"
		Quand je sélectionne l'option "Bénéficiaires de mon portefeuille" dans la liste "Bénéficiaires"
		Alors je vois "Giulia Diaby" sur la ligne "Conley"
