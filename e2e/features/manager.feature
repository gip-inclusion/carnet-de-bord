#language: fr

@deploiement
Fonctionnalité: Parcours Manager
	Pour pouvoir administrer un déploiement
	En tant que manager d'un déploiement
	Je veux pouvoir gérer mon déploiement, créer des structures et importer des bénéficiaires

	Scénario: Première connexion - Mise à jour profil
		Soit un utilisateur de type "manager" authentifié avec l'email "experimentation-e2e@noreply.beta.gouv.fr"
		Quand je vois "Première connexion à Carnet de bord"
		Quand je vois "Manager du déploiement expérimentation e2e"
		Quand je clique sur "Mettre à jour"
		Alors je vois "Mettre à jour mon compte"
		Quand je renseigne "José" dans le champ "Prénom"
		Quand je renseigne "Pâlefer" dans le champ "Nom"
		Quand j'appuie sur Entrée
		Alors je vois "Votre compte a été modifié avec succès"

	Scénario: Import de structures
		Soit un utilisateur de type "manager" authentifié avec l'email "experimentation-e2e@noreply.beta.gouv.fr"
		Quand je vois "État du territoire"
		Quand je clique sur "Importer des structures"
		Alors je vois "Veuillez fournir un fichier au format CSV."
		Quand je clique sur "Déposez votre fichier ou cliquez pour le rechercher sur votre ordinateur"
