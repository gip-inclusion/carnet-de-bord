#language: fr

Fonctionnalité: Onboarding manager
	Pour pouvoir finaliser la création de mon compte
	En tant que manager d'un déploiement
	Je veux pouvoir saisir et valider mes informations personnelles

	Scénario: Première connexion - Mise à jour profil
		Soit un "administrateur de territoire" authentifié pour la première fois avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Quand je vois "Création de mon compte Admin de territoire"

		Alors je vois "Agathe" dans le champ "Prénom"
		Alors je vois "DeBlouze" dans le champ "Nom"
		Alors je vois "contact+cd93@carnetdebord.inclusion.beta.gouv.fr" dans le champ "Courriel"
		Quand je clique sur "Créer mon compte"
		Alors je vois "Votre compte a été créé avec succès"
		Alors le lien "Accéder à mon compte" pointe sur "/manager"
