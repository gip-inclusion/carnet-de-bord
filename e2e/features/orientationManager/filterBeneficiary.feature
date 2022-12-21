#language: fr

Fonctionnalité: Fitrer la liste des bénéficiaires
	Pour pouvoir gérer les orientation
	En tant que chargé d'orientation
	Je veux pouvoir filtrer la liste des bénéficiaires

	Scénario: Rechercher un bénéficiaire à orienter dans la liste des autres bénéficiaires orientés
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je selectionne l'option "Autres bénéficiaires du territoire" dans la liste "Bénéficiaires"
		Quand je selectionne l'option "Orienté" dans la liste "Statut"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Alors je recherche "ca"
		Quand je clique sur "Rechercher"
		Alors je vois "Non assigné" sur la ligne "Cash"
		Alors je vois "Non assigné" sur la ligne "Carlson"

	Scénario: Afficher la liste des bénéficiaires à orienter de mon portefeuille
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Alors je vois "Samy Rouate" sur la ligne "Mcleod"
		Alors je vois "Samy Rouate" sur la ligne "Terry"
		Alors je vois "Samy Rouate" sur la ligne "Tran"

	Scénario: Afficher la liste des bénéficiaires déja orientés de mon portefeuille
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je selectionne l'option "Orienté" dans la liste "Statut"
		Alors je vois "Samy Rouate" sur la ligne "Bennet"
		Alors je vois "Samy Rouate" sur la ligne "Herrera"
		Alors je vois "Samy Rouate" sur la ligne "Jacobson"
		Alors je vois "Samy Rouate" sur la ligne "Raymond"
		Alors je vois "Samy Rouate" sur la ligne "Rice"

	Scénario: Afficher la liste des autres bénéficiaires non orientés
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je selectionne l'option "Autres bénéficiaires du territoire" dans la liste "Bénéficiaires"
		Alors j'attends que la table "Liste des bénéficiaires" apparaisse
		Alors je vois "Giulia Diaby" sur la ligne "Benjamin"
		Alors je vois "Non assigné" sur la ligne "Conley"

	Scénario: Afficher la liste des autres bénéficiaires non orientés sans chargé d'orientation
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je selectionne l'option "Autres bénéficiaires du territoire" dans la liste "Bénéficiaires"
		Quand je choisis "Bénéficiaires non pris en charge par un chargé d'orientation"
		Alors j'attends que la table "Liste des bénéficiaires" apparaisse
		Alors j'attends que la table "Liste des bénéficiaires" apparaisse
		Alors je vois "Non assigné" sur la ligne "Conley"
		Alors je ne vois pas "Benjamin"

	Scénario: Afficher la liste des autres bénéficiaires déjà orienter
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je selectionne l'option "Autres bénéficiaires du territoire" dans la liste "Bénéficiaires"
		Quand je selectionne l'option "Orienté" dans la liste "Statut"
		Alors j'attends que la table "Liste des bénéficiaires" apparaisse
		Alors je vois "Non assigné" sur la ligne "Aguilar"
		Alors je vois "Non assigné" sur la ligne "Beach"
		Alors je vois "Giulia Diaby" sur la ligne "Cobb"

	Scénario: Afficher la liste des autres bénéficiaires déjà orienter sans chargé d'orientation
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je selectionne l'option "Autres bénéficiaires du territoire" dans la liste "Bénéficiaires"
		Quand je selectionne l'option "Orienté" dans la liste "Statut"
		Quand je choisis "Bénéficiaires non pris en charge par un chargé d'orientation"
		Alors je vois "Non assigné" sur la ligne "Beach"
		Alors je ne vois pas "Cobb"
