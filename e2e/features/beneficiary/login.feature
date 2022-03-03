#language: fr

@beneficiary
Fonctionnalité: login beneficiaire
	Pour pouvoir voir mon carnet de bord
	En tant que beneficiaire
	Je veux pouvoir me connecter à l'application carnet de bord et voir mon carnet

Scénario: login beneficiaire
	Soit un utilisateur sur la page "/auth/login"
	Quand je renseigne "stifour93@yahoo.fr" dans le champ "Courriel"
	Quand je clique sur "Se connecter"
	Alors je vois "Si le compte existe, un lien vous a été envoyé pour vous connecter au Carnet de bord."

Scénario: Accueil beneficiaire
	Soit le bénéficiaire "stifour93@yahoo.fr" qui a cliqué sur le lien de connexion
	Alors je vois "Sophie Tifour"
