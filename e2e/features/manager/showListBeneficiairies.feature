#language: fr

@admin_structure_beneficiaries_list_view
Fonctionnalité: Consultation de la liste des bénéficiaires par un manager
	En tant que manager
	Je veux voir la liste des bénéficiaires

	Scénario: voir la liste
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Quand j'attends que la table "Liste des bénéficiaires" apparaisse
		Alors je vois la colonne "Date de naissance"
		Alors je vois "22/06/1996" sur la ligne "Lindsay"
