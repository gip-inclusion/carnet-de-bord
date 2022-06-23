#language: fr

@onboarding_manager
Fonctionnalité: Onboarding manager
	Pour pouvoir finaliser la création de mon compte
	En tant que manager d'un déploiement
	Je veux pouvoir saisir et valider mes informations personnelles

	Scénario: Première connexion - Mise à jour profil
		Soit un "administrateur pdi" authentifié pour la première fois avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je vois "Première connexion à Carnet de bord"
		Quand je vois "Manager du déploiement"
		Quand je clique sur "Mettre à jour"
		Alors je vois "Mettre à jour mon compte"
		Quand je renseigne "Gérard" dans le champ "Prénom"
		Quand je renseigne "Manvol" dans le champ "Nom"
		Quand j'appuie sur Entrée
		Alors je vois "Votre compte a été modifié avec succès"
