#language: fr

Fonctionnalité: Accès en lecture seule à un carnet dont je ne suis pas membre
	En tant que pro
	Je veux uniquement voir les informations personnelles et le groupe de suivi du bénificiaire

	Scénario: Accès au carnet
		Soit le pro "pierre.chevalier@livry-gargan.fr" qui a cliqué sur le lien de connexion
		Alors je vois "Rechercher un bénéficiaire"
		Quand je renseigne "myrna" dans le champ "Rechercher un bénéficiaire"
		Quand je clique sur "Rechercher"
		Alors je clique sur "Voir le carnet de Myrna Henderson"
		Alors j'attends que le texte "Myrna Henderson" apparaisse
		Alors je ne vois pas "Plan d'action"
		Alors je ne vois pas "Situation socioprofessionnelle"
		Alors je ne vois pas "Historique de parcours"
