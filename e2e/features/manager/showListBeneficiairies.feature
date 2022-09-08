#language: fr

@admin_structure_beneficiaries_list_view
Fonctionnalité: Consultation de la liste des bénéficiaires par un manager
	En tant que manager
	Je veux voir la liste des bénéficiaires

	Scénario: voir la liste
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Alors j'attends que le titre de page "Bénéficiaires" apparaisse
		Alors je vois la colonne "Date de naissance"
		Alors je vois "21/06/1996" dans la colonne "Date de naissance"
