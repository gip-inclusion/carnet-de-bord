#language: fr

Fonctionnalité: Gestion des RDV bénéficiaires
	En tant que pro
	Je veux consulter et gérer les RDV de mes bénéficiaires

	Scénario: Aucun rendez-vous
		Soit le pro "pcamara@seinesaintdenis.fr" sur le carnet de "Beach"
		Quand je clique sur la ligne du tableau contenant le texte "Paul Camara"
		Alors je vois "Aucun rendez-vous n'a été pris avec cet accompagnateur." dans le tableau "Liste des rendez-vous"

	# Scénario: Ajout de RDV
	# 	Soit le pro "pcamara@seinesaintdenis.fr" sur le carnet de "Beach"
	# 	Quand je clique sur la ligne du tableau contenant le texte "Paul Camara"
	# 	Quand je clique sur "Ajouter un rendez-vous"
	# 	Quand je renseigne "15/05/2020" dans le champ "Date de rendez-vous"
	# 	Quand je sélectionne l'option "15" dans la liste "Heures"
	# 	Quand je sélectionne l'option "45" dans la liste "Minutes"
	# 	Quand je sélectionne l'option "Présent" dans la liste "Statut du rendez-vous"
	# 	Quand je clique sur "Valider"
	# 	Alors je ne vois pas "Valider"
	# 	Alors je vois "15/05/2020 à 15:45"
	# 	Alors je vois "Présent"

	# Scénario: Derniers RDV dans Groupe de suivi
	# 	Soit le pro "pcamara@seinesaintdenis.fr" sur le carnet de "Beach"
	# 	Quand je clique sur la ligne du tableau contenant le texte "Paul Camara"
	# 	Quand je clique sur "Ajouter un rendez-vous"
	# 	Quand je renseigne "15/05/2020" dans le champ "Date de rendez-vous"
	# 	Quand je sélectionne l'option "15" dans la liste "Heures"
	# 	Quand je sélectionne l'option "45" dans la liste "Minutes"
	# 	Quand je sélectionne l'option "Présent" dans la liste "Statut du rendez-vous"
	# 	Quand je clique sur "Valider"
	# 	Quand je clique sur "Fermer"
	# 	Alors je ne vois pas "Membre du groupe de suivi"
	# 	Alors je vois "15/05/2020 à 15:45"

	# Scénario: Suppression d'un RDV
	# 	Soit le pro "pcamara@seinesaintdenis.fr" sur le carnet de "Beach"
	# 	Quand je clique sur la ligne du tableau contenant le texte "Paul Camara"
	# 	Quand je clique sur "Ajouter un rendez-vous"
	# 	Quand je renseigne "15/05/2020" dans le champ "Date de rendez-vous"
	# 	Quand je sélectionne l'option "15" dans la liste "Heures"
	# 	Quand je sélectionne l'option "45" dans la liste "Minutes"
	# 	Quand je sélectionne l'option "Présent" dans la liste "Statut du rendez-vous"
	# 	Quand je clique sur "Valider"
	# 	Quand je clique sur "Modifier"
	# 	Quand je clique sur "Supprimer"
	# 	Alors je vois "Vous allez supprimer le rendez-vous du"
	# 	Alors je vois "15/05/2020 à 15:45"
	# 	Alors je vois "Veuillez confirmer la suppression."
	# 	Quand je clique sur le bouton "Supprimer"
	# 	Alors je ne vois pas "15/05/2020 à 15:45"
	# 	Alors je ne vois pas "Présent"
