#language: fr

Fonctionnalité: Fitrer la liste des bénéficiaires
	Pour pouvoir gérer les orientation
	En tant que chargé d'orientation
	Je veux pouvoir filtrer la liste des bénéficiaires

	Scénario: Rechercher un bénéficiaire à orienter dans la liste des autres bénéficiaires orientés
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je selectionne l'option "Autres bénéficiaires du territoire" dans la liste "Bénéficiaires"
		Quand je selectionne l'option "Avec un référent" dans la liste "Statut"
		Quand j'attends que le titre de page "Bénéficiaires" apparaisse
		Alors je recherche "ca"
		Quand je clique sur "Rechercher"
		Alors je vois "Non assigné" sur la ligne "Carlson Oconnor"
		Alors je vois "Non assigné" sur la ligne "Cash Corinne"

	Scénario: Afficher la liste des bénéficiaires à orienter de mon portefeuille
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je selectionne l'option "Bénéficiaires de mon portefeuille" dans la liste "Bénéficiaires"
		Quand je selectionne l'option "Sans référent" dans la liste "Statut"
		Quand j'attends que le tableau "Liste des bénéficiaires" apparaisse
		Alors je vois "Samy Rouate" sur la ligne "Bennett Payne"
		Alors je vois "Samy Rouate" sur la ligne "Herrera Henderson"
		Alors je vois "Samy Rouate" sur la ligne "Jacobson Hester"

	Scénario: Afficher la liste des bénéficiaires déja orientés de mon portefeuille
		Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je selectionne l'option "Bénéficiaires de mon portefeuille" dans la liste "Bénéficiaires"
		Quand je selectionne l'option "Avec un référent" dans la liste "Statut"
		Alors je vois "Giulia Diaby" sur la ligne "Bullock Etta"
		Alors je vois "Giulia Diaby" sur la ligne "Tifour Sophie"

	Scénario: Afficher la liste des autres bénéficiaires non orientés
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je selectionne l'option "Autres bénéficiaires du territoire" dans la liste "Bénéficiaires"
		Quand je selectionne l'option "Sans référent" dans la liste "Statut"
		Alors j'attends que le tableau "Liste des bénéficiaires" apparaisse
		Alors je vois "Non assigné" sur la ligne "Aguilar Lindsay"
		Alors je vois "Giulia Diaby" sur la ligne "Benjamin Whitley"

	Scénario: Afficher la liste des autres bénéficiaires non orientés sans chargé d'orientation
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je selectionne l'option "Autres bénéficiaires du territoire" dans la liste "Bénéficiaires"
		Quand je selectionne l'option "Sans référent" dans la liste "Statut"
		Quand je choisis "Bénéficiaires non pris en charge par un chargé d'orientation"
		Alors j'attends que le tableau "Liste des bénéficiaires" apparaisse
		Alors je vois "Non assigné" sur la ligne "Aguilar Lindsay"
		Alors je ne vois pas "Benjamin Whitley"

	Scénario: Afficher la liste des autres bénéficiaires déjà orienté
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je selectionne l'option "Autres bénéficiaires du territoire" dans la liste "Bénéficiaires"
		Quand je selectionne l'option "Avec un référent" dans la liste "Statut"
		Alors j'attends que le tableau "Liste des bénéficiaires" apparaisse
		Alors je vois "Giulia Diaby" sur la ligne "Bullock Etta"
		Alors je vois "Non assigné" sur la ligne "Herring Janie"
		Alors je vois "Non assigné" sur la ligne "Jennings Dee"

	Scénario: Afficher la liste des autres bénéficiaires déjà orienté sans chargé d'orientation
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je selectionne l'option "Autres bénéficiaires du territoire" dans la liste "Bénéficiaires"
		Quand je selectionne l'option "Avec un référent" dans la liste "Statut"
		Quand je choisis "Bénéficiaires non pris en charge par un chargé d'orientation"
		Alors je vois "Non assigné" sur la ligne "Herring Janie"
		Alors je vois "Non assigné" sur la ligne "Jennings Dee"
		Alors je ne vois pas "Bullock Etta"
