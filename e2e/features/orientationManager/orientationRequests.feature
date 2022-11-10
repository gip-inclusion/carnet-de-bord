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

  Scénario: Une demande de réorientation
  	Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
  	Quand j'attends que le titre de page "Orientation des bénéficiaires" apparaisse
		Alors je vois "Demandes de réorientation"
  	Quand je clique sur "Demandes de réorientation"
		Quand j'attends que le titre de page "Demandes de réorientation" apparaisse
  	Alors je vois "01/09/2022"
  	Alors je vois "Etta Bullock"
  	Alors je vois "Social"
		Quand je clique sur le bouton "Motif de la demande de réorientation de Etta Bullock"
		Alors je vois "Motif de la demande de réorientation de Etta Bullock"
		Alors je vois "Ceci est la raison pour laquelle on souhaite changer l’orientation"
		Alors je clique sur "Fermer"
		Quand je clique sur "Voir le carnet de Etta Bullock"
		Quand je vais sur l'onglet suivant
		Alors je suis sur la page "/orientation/carnets/24e335cb-4e2b-481b-84b7-617d77f60f56"
