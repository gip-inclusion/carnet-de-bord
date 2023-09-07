#language: fr

Fonctionnalité: Fitrer la liste des bénéficiaires
	Pour pouvoir gérer les orientation
	En tant que chargé d'orientation
	Je veux pouvoir filtrer la liste des bénéficiaires

	Scénario: Filtrer la liste des bénéficiaires de mon portefeuille
		Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je sélectionne l'option "Bénéficiaires de mon portefeuille" dans la liste "Bénéficiaires"
		Alors je vois 10 lignes dans le tableau "Liste des bénéficiaires"
		Alors je vois "Giulia DIABY" sur la ligne "BENJAMIN Whitley"
		Quand je sélectionne l'option "Accompagné" dans la liste "Statut"
		Alors je vois 2 lignes dans le tableau "Liste des bénéficiaires"
		Alors je vois "ORIAL Edith" sur la ligne "BULLOCK Etta"
		Alors je vois "Pierre CHEVALIER" sur la ligne "TIFOUR Sophie"
		Quand je sélectionne l'option "En attente d'un référent" dans la liste "Statut"
		Alors je vois 8 lignes dans le tableau "Liste des bénéficiaires"
		Quand je sélectionne l'option "Non accompagné" dans la liste "Statut"
		Alors je vois 1 lignes dans le tableau "Liste des bénéficiaires"
		Alors je vois "Non rattaché" sur la ligne "Hoffman Buckley"
		Quand je sélectionne l'option "Avec une demande de réorientation" dans la liste "Statut"
		Alors je vois 1 lignes dans le tableau "Liste des bénéficiaires"
		Alors je vois "ORIAL Edith" sur la ligne "BULLOCK Etta"

	Scénario: Filtrer la liste des autres bénéficiaires du territoire
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je sélectionne l'option "Autres bénéficiaires du territoire" dans la liste "Bénéficiaires"
		Alors je vois "Non assigné" sur la ligne "AGUILAR Lindsay"
		Quand je sélectionne l'option "Accompagné" dans la liste "Statut"
		Alors je vois 7 lignes dans le tableau "Liste des bénéficiaires"
		Alors je vois "ORIAL Edith" sur la ligne "BULLOCK Etta"
		Alors je vois "Pierre CHEVALIER" sur la ligne "TIFOUR Sophie"
		Quand je sélectionne l'option "En attente d'un référent" dans la liste "Statut"
		Alors je vois "Centre Communal d'action social Livry-Gargan" sur la ligne "AGUILAR Lindsay"
		Alors je vois "Groupe NS" sur la ligne "BENJAMIN Whitley"
		Quand je sélectionne l'option "Non accompagné" dans la liste "Statut"
		Alors je vois 2 lignes dans le tableau "Liste des bénéficiaires"
		Alors je vois "Non rattaché" sur la ligne "Craig Reilly"
		Alors je vois "Non rattaché" sur la ligne "Hoffman Buckley"
		Quand je sélectionne l'option "tous" dans la liste "Statut"
		Quand je sélectionne l'option "tous" dans la liste "Bénéficiaires"
		Quand je coche "Bénéficiaires tenus aux obligations « droits et devoirs RSA »"
		Alors je vois "Groupe NS" sur la ligne "Keller Noel"


	Scénario: Rechercher un bénéficiaire sans chargé d'orientation dans la liste des autres bénéficiaires accompagnés
		Soit un "chargé d'orientation" authentifié avec l'email "samy.rouate@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Alors je recherche "ca"
		Quand je sélectionne l'option "Autres bénéficiaires du territoire" dans la liste "Bénéficiaires"
		Quand je sélectionne l'option "En attente d'un référent" dans la liste "Statut"
		Quand je clique sur "Rechercher"
		Alors je vois "Non assigné" sur la ligne "CARLSON Oconnor"
		Alors je vois "Non assigné" sur la ligne "Cash Corinne"
