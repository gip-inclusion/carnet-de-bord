#language: fr

Fonctionnalité: Liste des demandes de réorientation
	Pour pouvoir gérer les demandes de réorientation
	En tant que chargé d'orientation
	Je veux pouvoir consulter la liste des demandes de réorientation

	Scénario: Aucune demande de réorientation
		Soit un "chargé d'orientation" authentifié avec l'email "laure.loge@cd51.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je sélectionne l'option "Avec une demande de réorientation" dans la liste "Statut"
		Quand j'attends que le tableau "Liste des bénéficiaires" apparaisse
		Alors je vois "Aucun bénéficiaire"

  Scénario: Une demande de réorientation
		Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je sélectionne l'option "Avec une demande de réorientation" dans la liste "Statut"
		Quand j'attends que le tableau "Liste des bénéficiaires" apparaisse
		Alors je vois "Carlson Oconnor"
		Quand je clique sur le bouton "Voir la demande de réorientation de Oconnor Carlson"
		Alors je vois "Demande de réorientation de Oconnor Carlson"
		Alors je vois "PROFESSIONNEL"
		Alors je vois "01/09/2022"
		Alors je vois "Un accompagnement pro sera plus adapté."
		Alors je clique sur "Fermer"
		Quand je clique sur "Voir le carnet de Oconnor Carlson"
		Alors je suis sur la page "/orientation/carnets/fb0e54ce-5cb8-460c-952c-9256d4c6102e"

	Scénario: Ne pas afficher les demandes de réorientation traitées
		Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
		Quand je clique sur "Bénéficiaires"
		Et j'attends que le tableau "Liste des bénéficiaires" apparaisse
		Alors je vois "Voir la demande de réorientation de Etta Bullock"
		Quand je clique sur "Voir le carnet de Etta Bullock"
		Et je clique sur le bouton "Maintenir l'accompagnement"
		Et je clique sur "Oui"
		Et je navigue vers la page précédente
		Alors je ne vois pas "Voir la demande de réorientation de Etta Bullock"
