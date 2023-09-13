#language: fr

Fonctionnalité: Onboarding chargé d'orientation
	Pour pouvoir finaliser la création de mon compte
	En tant que chargé d'orientation
	Je veux pouvoir saisir et valider mes informations personnelles

	Scénario: Première connexion - Mise à jour profil
		Soit un "chargé d'orientation" authentifié pour la première fois avec l'email "giulia.diaby@cd93.fr"
		Quand je vois "Création de mon compte Chargé d'orientation"
		Alors je vois "Giulia" dans le champ "Prénom"
		Alors je vois "DIABY" dans le champ "Nom"
		Alors je vois "giulia.diaby@cd93" dans le champ "Courriel"
		Alors je vois "0912345678, 0612345678" dans le champ "Numéros de téléphone"
		Quand je clique sur "Créer mon compte"
		Alors je vois "Votre compte a été créé avec succès"
