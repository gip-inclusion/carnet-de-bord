#language: fr

@beneficiary
Fonctionnalité: Page d'accueil beneficiary
	Pour pouvoir voir mon carnet de bord
	En tant que beneficiaire
	Je veux pouvoir me connecter à l'application carnet de bord

Scénario:
	Soit un utilisateur sur la page de "/auth/login"
	Quand je renseigne "stifour93@yahoo.fr" dans le champs "Courriel"
	Quand Je clique sur "se connecter"
	Alors je vois "Un lien vous a été envoyé pour vous connecter au Carnet de bord."

