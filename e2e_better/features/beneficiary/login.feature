#language: fr

Fonctionnalité: login beneficiaire
	Pour pouvoir voir mon carnet de bord
	En tant que beneficiaire
	Je veux pouvoir me connecter à l'application carnet de bord et voir mon carnet

Scénario: login beneficiaire
	Soit un utilisateur sur la page "/auth/login"
	Quand je renseigne "stifour93@yahoo.fr" dans le champ "Courriel"
	Quand je clique sur "Se connecter"
	Alors je vois "Un lien vous a été envoyé pour vous connecter au Carnet de bord."


Scénario: Accueil beneficiaire
	Soit un "bénéficiaire" authentifié avec l'email "stifour93@yahoo.fr"
	Alors je vois "Sophie Tifour"
