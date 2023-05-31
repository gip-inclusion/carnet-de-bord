#language: fr

Fonctionnalité: Page d'accueil
	Pour pouvoir me renseigner sur carnet de bord
	En tant que visiteur
	Je veux pouvoir consulter la page d'accueil

Scénario: Home CdB
	Soit un utilisateur sur la page d'accueil
	Alors je vois "Bienvenue sur Carnet de bord !"
	Alors le lien "Accéder à mon compte" pointe sur "/auth/login"

Scénario: Demande de consentement
	Soit un utilisateur sur la page d'accueil
	Alors je vois "Ce site utilise des cookies et vous donne le contrôle sur ceux que vous souhaitez activer"
 	Quand je clique sur "Personnaliser"
	# Pour une raison inconnue, on doit faire une deuxiement click
	# dans codecept pour que la fenetre s'ouvre.
 	Quand je clique sur "Personnaliser"
	Alors je vois "Préférences pour tous les services"
	Alors je clique sur "Tout accepter"
	Alors je ne vois pas "Ce site utilise des cookies et vous donne le contrôle sur ceux que vous souhaitez activer"
	Soit un "pro" authentifié pour la première fois avec l'email "pierre.chevalier@livry-gargan.fr"
	Quand je clique sur "Ouvrir le chat"
	Alors je vois "Comment puis-je vous aider"
