#language: fr

Fonctionnalité: Liste des demandes de réorientation
	Pour pouvoir gérer les demandes de réorientation
	En tant que chargé d'orientation
	Je veux pouvoir consulter la liste des demandes de réorientation

	Scénario: Aucune demande de réorientation
		Soit un "chargé d'orientation" authentifié avec l'email "laure.loge@cd51.fr"
		Quand j'attends que le titre de page "Orientation des bénéficiaires" apparaisse
		Alors je ne vois pas "Demandes de réorientation"
		Quand je vais sur la page "/orientation/demandes"
		Quand j'attends que le titre de page "Demandes de réorientation" apparaisse
		Alors je vois "Aucune demande"

		#	Scénario: Aucune demande de réorientation - bis
		#		Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
		#		Quand j'attends que le titre de page "Orientation des bénéficiaires" apparaisse
		#		Quand je recherche "Aguilar"
		#		Quand je clique sur "Rechercher"
		#		Alors je vois "Non assigné" sur la ligne "Aguilar"
		#		Quand je clique sur "Non assigné"
		#		Alors je vois "Assigner un chargé d'orientation"
		#		Alors j'attends que le texte "Veuillez sélectionner le chargé d'orientation" apparaisse
		#		Alors je selectionne l'option "Giulia Diaby" dans la liste "Nom du chargé d’orientation"
		#		Quand je clique sur "Assigner"
		#		Alors je vois "Giulia Diaby" sur la ligne "Aguilar"
