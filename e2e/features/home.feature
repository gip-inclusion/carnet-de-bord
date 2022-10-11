#language: fr

Fonctionnalité: Page d'accueil
	Pour pouvoir me renseigner sur carnet de bord
	En tant que visiteur
	Je veux pouvoir consulter la page d'accueil

Scénario: Home CdB
	Soit un utilisateur sur la page d'accueil
	Alors je vois "Bienvenue sur Carnet de bord !"
	Alors le lien "Accéder à mon compte" pointe sur "/auth/login"
