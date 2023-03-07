#language: fr

Fonctionnalité: Modale de séléction du NPS
	En tant que chargé d'orientation assigné
	Je veux répondre au sondage de satisfaction NPS

	Scénario: Réponse au sondage NPS
		Soit un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
		Alors je vois "Quelle est la probabilité que vous recommandiez Carnet de Bord à un collègue ?"
		Quand je clique sur "10"
        Quand je clique sur "Envoyer ma réponse"
        Alors je ne vois pas "Quelle est la probabilité que vous recommandiez Carnet de Bord à un collègue ?"

        Quand je rafraichis la page
        Alors je ne vois pas "Quelle est la probabilité que vous recommandiez Carnet de Bord à un collègue ?"
