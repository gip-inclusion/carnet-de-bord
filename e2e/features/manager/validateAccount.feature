#language: fr

@professionnel_view
Fonctionnalité: Gestion de professionnels d'un déploiement
	Pour pouvoir gérer les professionnels de la plateforme
	En tant que manager d'un déploiement
	Je veux pouvoir voir les professionnels et gérer leur activation

	Scénario: Liste des professionnels
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Professionnels"
		Quand j'attends que la table "Liste des professionnels" apparaisse
		Alors je vois "1" sur la ligne "Giulia Diaby"
		Alors je vois "0" sur la ligne "Blaise Alaise"

	Scénario: Validation d'un professionnel
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Professionnels"
		Quand j'attends que la table "Liste des professionnels" apparaisse
		Quand je clique sur "Activer"
		Quand j'attends 1 secondes
		Alors je vois "Actif" sur la ligne "Lejeune Bienvenu"
