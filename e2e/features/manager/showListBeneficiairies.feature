#language: fr

@admin_structure_beneficiaries_list_view
Fonctionnalité: Consultation de la liste des bénéficiaires par un manager
	En tant que manager
	Je veux voir la liste des bénéficiaires

	Scénario: Voir la liste
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Quand j'attends que la table "Liste des bénéficiaires" apparaisse
		Alors je vois la colonne "Date de naissance"
		Alors je vois "22/06/1996" sur la ligne "Lindsay"

	Scénario: Voir la liste des bénéficiaires d'un professionnel
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Professionnels"
		Quand je clique sur "liste des bénéficiaires de Pierre Chevalier"
		Alors je vois "pierre.chevalier@livry-gargan.fr"
		Alors je vois "Supprimer le filtre"
		Alors je vois "Tifour" dans le tableau "Liste des bénéficiaires"

	Scénario: Supprimer le filtre professionnel
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Professionnels"
		Quand je clique sur "liste des bénéficiaires de Pierre Chevalier"
		Quand je clique sur "Supprimer le filtre"
		Alors je ne vois pas "Supprimer le filtre"
		Alors je vois "Aguilar" dans le tableau "Liste des bénéficiaires"
