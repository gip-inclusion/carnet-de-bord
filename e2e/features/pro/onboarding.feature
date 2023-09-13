#language: fr

Fonctionnalité: Onboarding professionnel
	Pour pouvoir finaliser la création de mon compte
	En tant que professionnel
	Je veux pouvoir saisir et valider mes informations personnelles

	Scénario: Première connexion - Mise à jour profil
		Soit un "pro" authentifié pour la première fois avec l'email "jeanpoiret@mission-locale.fr"
		Quand je vois "Création de mon compte professionnel"
		Alors je vois "Jean" dans le champ "Prénom"
		Alors je vois "POIRET" dans le champ "Nom"
		Alors je vois "jeanpoiret@mission-locale.fr" dans le champ "Courriel"
		Alors je vois "" dans le champ "Téléphone"
		Alors je vois "Conseiller Logement" dans le champ "Fonction"
		Quand je clique sur "Créer mon compte"
		Alors je vois "Votre compte a été créé avec succès"
		Alors le lien "Accéder à mon compte" pointe sur "/pro"
