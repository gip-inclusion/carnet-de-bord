#language: fr

Fonctionnalité: Onboarding administrateur de structure
	Pour pouvoir finaliser la création de mon compte
	En tant qu'administrateur de structure
	Je veux pouvoir saisir et valider mes informations personnelles

	Scénario: Première connexion - Mise à jour profil
		Soit un "administrateur de structures" authentifié pour la première fois avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je vois "Création de mon compte Gestionnaire de structure"
		Alors je vois "Jacques" dans le champ "Prénom"
		Alors je vois "CÉLAIRE" dans le champ "Nom"
		Alors je vois "jacques.celaire@livry-gargan.fr" dans le champ "Courriel"
		Alors je vois "0102030405" dans le champ "Numéros de téléphone"
		Quand je clique sur "Créer mon compte"
		Alors je vois "Votre compte a été créé avec succès"
		Alors le lien "Accéder à mon compte" pointe sur "/structures"
