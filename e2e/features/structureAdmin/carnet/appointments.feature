#language: fr

Fonctionnalité: Gestion des RDV bénéficiaires
	En tant qu'admin de structure
	Je veux consulter et gérer les RDV de mes bénéficiaires

	Scénario: Aucun rendez-vous pour un admin de structure
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Alors je clique sur "Bénéficiaires non accompagnés"
		Alors j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je clique sur "Voir le carnet de Myrna Henderson"
		Quand je vais sur l'onglet suivant
		Alors j'attends que le texte "Myrna Henderson" apparaisse
		Quand je clique sur la ligne du tableau contenant le texte "Giulia DIABY"
		Alors je vois "Aucun rendez-vous n'a été pris avec cet accompagnateur." dans le tableau "Liste des rendez-vous"



	Scénario: Ajout de RDV par un admin de structure
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Alors je clique sur "Bénéficiaires non accompagnés"
		Alors j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je clique sur "Voir le carnet de Myrna Henderson"
		Quand je vais sur l'onglet suivant
		Alors j'attends que le texte "Myrna Henderson" apparaisse
		Quand je clique sur la ligne du tableau contenant le texte "Giulia DIABY"
		Quand je clique sur "Ajouter un rendez-vous"
		Quand je renseigne "15/05/2020" dans le champ "Date de rendez-vous"
		Quand je sélectionne l'option "15" dans la liste "Heures"
		Quand je sélectionne l'option "45" dans la liste "Minutes"
		Quand je sélectionne l'option "Présent" dans la liste "Statut du rendez-vous"
		Quand je clique sur "Valider"
		Alors je ne vois pas "Valider"
		Alors je vois "15/05/2020 à 15:45"
		Alors je vois "Présent"


	Scénario: Derniers RDV dans Groupe de suivi pour un admin de structure
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Alors je clique sur "Bénéficiaires non accompagnés"
		Alors j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je clique sur "Voir le carnet de Myrna Henderson"
		Quand je vais sur l'onglet suivant
		Alors j'attends que le texte "Myrna Henderson" apparaisse
		Quand je clique sur la ligne du tableau contenant le texte "Giulia DIABY"
		Quand je clique sur "Ajouter un rendez-vous"
		Quand je renseigne "15/05/2020" dans le champ "Date de rendez-vous"
		Quand je sélectionne l'option "15" dans la liste "Heures"
		Quand je sélectionne l'option "45" dans la liste "Minutes"
		Quand je sélectionne l'option "Présent" dans la liste "Statut du rendez-vous"
		Quand je clique sur "Valider"
		Quand je clique sur "Fermer"
		Alors je ne vois pas "Membre du groupe de suivi"
		Alors je vois "15/05/2020 à 15:45"


	Scénario: Suppression d'un RDV par un admin de structure
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Alors je clique sur "Bénéficiaires non accompagnés"
		Alors j'attends que le titre de page "Bénéficiaires" apparaisse
		Quand je clique sur "Voir le carnet de Myrna Henderson"
		Quand je vais sur l'onglet suivant
		Alors j'attends que le texte "Myrna Henderson" apparaisse
		Quand je clique sur la ligne du tableau contenant le texte "Giulia DIABY"
		Quand je clique sur "Ajouter un rendez-vous"
		Quand je renseigne "15/05/2020" dans le champ "Date de rendez-vous"
		Quand je sélectionne l'option "15" dans la liste "Heures"
		Quand je sélectionne l'option "45" dans la liste "Minutes"
		Quand je sélectionne l'option "Présent" dans la liste "Statut du rendez-vous"
		Quand je clique sur "Valider"
		Quand je clique sur "Modifier"
		Quand je clique sur "Supprimer"
		Alors je vois "Vous allez supprimer le rendez-vous du"
		Alors je vois "15/05/2020 à 15:45"
		Alors je vois "Veuillez confirmer la suppression."
		Quand je clique sur le bouton "Supprimer"
		Alors je ne vois pas "15/05/2020 à 15:45"
		Alors je ne vois pas "Présent"
