#language: fr

Fonctionnalité: Assignation d'un chargé d'orientation
	Pour pouvoir gérer les orientation
	En tant que chargé d'orientation
	Je veux pouvoir assigner un chargé d'orientation à un bénéficiaire

	Scénario: Modifier le rattachement d'un bénéficiaire
		Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
		Quand j'attends que le titre de page "Orientation des bénéficiaires" apparaisse
		Quand je recherche "Aguilar"
		Quand je clique sur "Rechercher"
		Alors je vois "Non assigné" sur la ligne "Aguilar"
		Quand je clique sur "Non assigné"
		Alors je vois "Assigner un chargé d'orientation"
		Alors j'attends que le texte "Veuillez sélectionner le chargé d'orientation" apparaisse
		Alors je selectionne l'option "Giulia Diaby" dans la liste "Nom du chargé d’orientation"
		Quand je clique sur "Assigner"
		Alors je vois "Giulia Diaby" sur la ligne "Aguilar"
