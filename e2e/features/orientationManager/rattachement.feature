#language: fr

Fonctionnalité: Orientation par un chargé d'orientation
	Pour pouvoir gérer les orientation
	En tant que chargé d'orientation
	Je veux pouvoir assigner un référent aux bénéficiaires

	Scénario: Modifier le dispositif d'accompagnement d'un bénéficiaire
		Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je sélectionne l'option "Accompagné" dans la liste "Statut"
		Quand j'attends que le tableau "Liste des bénéficiaires" apparaisse
		Alors je vois "Pierre CHEVALIER" sur la ligne "TIFOUR Sophie"
		Quand je clique sur "Pierre CHEVALIER" dans la ligne de "TIFOUR Sophie"
		Alors je vois "Réorienter"
		Alors j'attends que le texte "Veuillez sélectionner le dispositif d'accompagnement ainsi que la nouvelle structure et le nouveau référent" apparaisse
		Alors je sélectionne l'option "Social" dans la liste "Dispositif d'accompagnement"
		Alors je sélectionne l'option "Groupe NS (0)" dans la liste "Nom de la structure"
		Alors je sélectionne l'option "Simon ANKA (0)" dans la liste "Nom du référent unique"
		Quand je clique sur "Valider"
		Alors je vois "Groupe NS - Simon ANKA" sur la ligne "TIFOUR Sophie"

	Scénario: Ré-orienter des bénéficiaires
		Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je sélectionne l'option "Bénéficiaires de mon portefeuille" dans la liste "Bénéficiaires"
		Quand je sélectionne l'option "En attente d'un référent" dans la liste "Statut"
		Quand j'attends que le tableau "Liste des bénéficiaires" apparaisse
		Alors je choisis "Sélectionner Myrna HENDERSON"
		Alors je choisis "Sélectionner Della LYNCH"
		Alors je vois "2 sélectionnés"
		Quand je clique sur "Rattacher"
		Alors je vois "Réorienter"
		Alors j'attends que le texte "Veuillez sélectionner le dispositif d'accompagnement ainsi que la nouvelle structure et le nouveau référent" apparaisse
		Alors je sélectionne l'option "Socio-professionnel" dans la liste "Dispositif d'accompagnement"
		Alors je sélectionne l'option "Service Social Départemental (2)" dans la liste "Nom de la structure"
		Alors je sélectionne l'option "Paul CAMARA (2)" dans la liste "Nom du référent unique"
		Quand je clique sur "Valider" dans le volet "Réorienter"
		Alors je ne vois pas "HENDERSON Myrna"
		Alors je ne vois pas "LYNCH Della"
		Quand je sélectionne l'option "Accompagné" dans la liste "Statut"
		Alors je vois "Service Social Départemental" sur la ligne "HENDERSON Myrna"
		Alors je vois "Service Social Départemental" sur la ligne "LYNCH Della"
