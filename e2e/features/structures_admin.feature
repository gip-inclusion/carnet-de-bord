#language: fr

@admin_structures
Fonctionnalité: Parcours Administrateur de structures
	Pour pouvoir administrer mes structures
	En tant qu'administrateur de structures
	Je veux pouvoir gérer les structures qui me sont attribuées

	Scénario: Première connexion - Mise à jour profil
		Soit un utilisateur de type "admin_structure" authentifié avec l'email "jean.paul@drome.fr"
		Quand je vois "Création de mon compte Gestionnaire de structure"
		Alors je vois "jean" dans le champ "Prénom"
		Alors je vois "paul" dans le champ "Nom"
		Alors je vois "jean.paul@drome.fr" dans le champ "Courriel"
		Alors je vois "061234567, 091234567" dans le champ "Numéros de téléphone"
		Alors je clique sur "Créer mon compte"
