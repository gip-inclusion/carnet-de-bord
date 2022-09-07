#language: fr

@appointments @pro
Fonctionnalité: Gestion des RDV bénéficiaires
	En tant que pro
	Je veux consulter et gérer les RDV de mes bénéficiaires

	Scénario: Aucun rendez-vous
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
		Quand je clique sur "Groupe de suivi"
		Quand je clique sur la ligne du tableau contenant le texte "Pierre Chevalier"
		Alors je vois "Aucun rendez-vous n'a été pris avec cet accompagnateur." dans le tableau "Liste des rendez-vous"

	Scénario: Ajout de RDV
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
		Quand je clique sur "Groupe de suivi"
		Quand je clique sur la ligne du tableau contenant le texte "Pierre Chevalier"
		Quand je clique sur "Ajouter un rendez-vous"
		Quand je renseigne "01/01/2020" dans le champ "Date de rendez-vous"
		Quand je selectionne l'option "15" dans la liste "Heures"
		Quand je selectionne l'option "45" dans la liste "Minutes"
		Quand je selectionne l'option "Présent" dans la liste "Statut du rendez-vous"
		Quand je clique sur "Valider"
		Alors je ne vois pas "Valider"
		Alors je vois "01/01/2020 à 15:45"
		Alors je vois "Présent"

	Scénario: Derniers RDV dans Groupe de suivi
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
		Quand je clique sur "Groupe de suivi"
		Quand je clique sur la ligne du tableau contenant le texte "Pierre Chevalier"
		Quand je clique sur "Ajouter un rendez-vous"
		Quand je renseigne "01/01/2020" dans le champ "Date de rendez-vous"
		Quand je selectionne l'option "15" dans la liste "Heures"
		Quand je selectionne l'option "45" dans la liste "Minutes"
		Quand je selectionne l'option "Présent" dans la liste "Statut du rendez-vous"
		Quand je clique sur "Valider"
		Quand je clique sur "Fermer"
		Alors je ne vois pas "Membre du groupe de suivi"
		Alors je vois "01/01/2020 à 15:45"
