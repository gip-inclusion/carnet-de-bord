#language: fr

Fonctionnalité: Suppression d'un professionnel
	Pour pouvoir gérer plus facilement l'administration d'une structure
	En tant que gestionnaire de structure
	Je veux pouvoir supprimer un professionnel

	Scénario: Suppression d'un professionnel
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Quand je clique sur "Professionnels"
		Quand je clique sur "Supprimer" dans la ligne de "Pierre Chevalier"
		Alors je vois "Supprimer"
		Quand je clique sur "Supprimer" dans le volet "Supprimer"
		Alors je ne vois pas "Pierre Chevalier"

	Scénario: Le compte d'un professionnel supprimé ne permet pas la connexion
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Quand je clique sur "Professionnels"
		Quand je clique sur "Supprimer" dans la ligne de "Pierre Chevalier"
		Quand je clique sur "Supprimer" dans le volet "Supprimer"
		Quand je clique sur "Déconnexion"
		Quand je clique sur "Oui" dans le volet "Déconnexion"
		Quand je clique sur "Accéder à mon compte"
		Quand je renseigne "pierre.chevalier@livry-gargan.fr" dans le champ "Courriel"
		Quand je clique sur "Se connecter"
		Alors je ne vois pas "Un lien vous a été envoyé pour vous connecter au Carnet de bord."
		Alors je vois "Ce courriel n'est pas rattaché à un compte existant"
