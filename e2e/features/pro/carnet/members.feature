#language: fr

Fonctionnalité: Groupe de suivi
	En tant que pro
	Je veux voir le groupe de suivi du bénéficiaire

Scénario: Consulter le groupe de suivi
	Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
	Quand j'attends que la table "Liste des membres du groupe de suivi" apparaisse
	Alors je vois "référent" sur la ligne "Pierre Chevalier"

Scénario: Inviter un membre dans le groupe de suivi
	Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
	Quand j'attends que la table "Liste des membres du groupe de suivi" apparaisse
	Alors je clique sur "Inviter un accompagnateur"
	Alors je renseigne "social" dans le champ "Rechercher un accompagnateur"
	Quand je clique sur "Rechercher"
	Quand je choisis "Service Social Départemental"
	Quand je clique sur "Envoyer"
	Quand je clique sur "J'ai compris"
	Alors je vois "Camara" dans le tableau "Liste des membres du groupe de suivi"

Scénario: Se retirer du groupe de suivi
	Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
	Quand j'attends que la table "Liste des membres du groupe de suivi" apparaisse
	Quand je clique sur "Se détacher"
	Quand je clique sur "Confirmer"
	Alors je vois "Carnet introuvable"
