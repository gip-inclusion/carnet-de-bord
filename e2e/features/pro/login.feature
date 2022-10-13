#language: fr

Fonctionnalité: Login pro
	En tant que pro
	Je veux pouvoir me connecter et voir ma page d'accueil

Scénario: Login pro
	Soit un utilisateur sur la page "/auth/login"
	Quand je renseigne "pierre.chevalier@livry-gargan.fr" dans le champ "Courriel"
	Quand je clique sur "Se connecter"
	Alors je vois "Un lien vous a été envoyé pour vous connecter au Carnet de bord."

Scénario: Accueil pro
	Soit le pro "pierre.chevalier@livry-gargan.fr" qui a cliqué sur le lien de connexion
	Alors je vois "Rechercher un bénéficiaire"
