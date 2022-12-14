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

Scénario: Se retirer du groupe de suivi et de la structure
	Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
	Quand j'attends que la table "Liste des membres du groupe de suivi" apparaisse
	Quand je clique sur "Se détacher"
	Alors je vois "Souhaitez-vous être détaché du carnet de bord et ne plus accéder en écriture à celui-ci ?"
	Quand je clique sur "Oui"
	Alors je vois "Sophie Tifour"
	Alors je vois "Informations personnelles"
	Alors je vois "Groupe de suivi"
	Alors je ne vois pas "Pierre Chevalier"
	Alors je ne vois pas "Informations socioprofessionnelles"
  Quand un "chargé d'orientation" authentifié avec l'email "giulia.diaby@cd93.fr"
  Quand je clique sur "Bénéficiaires"
	Quand je selectionne l'option "Orienté" dans la liste "Statut"
	Alors je vois "Non rattaché" sur la ligne "Tifour"
