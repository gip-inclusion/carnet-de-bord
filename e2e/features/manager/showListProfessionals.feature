#language: fr

Fonctionnalité: Consultation de la liste des professionnels par un administrateur de structure
	En tant qu'administrateur de structure
	Je veux voir la liste des professionnels de la structure

	Scénario: voir la liste
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Quand je clique sur "Professionnels"
		Quand j'attends que le tableau "Liste des professionnels" apparaisse
		Alors je vois la colonne "Prénom nom"
		Alors je vois la colonne "Téléphone"
		Alors je vois la colonne "Email"
		Alors je vois la colonne "Onboarding"
		Alors je vois la colonne "BRSA suivis"
		Alors je vois "pierre.chevalier@livry-gargan.fr" sur la ligne "Pierre Chevalier"
		Alors je vois "01 41 70 88 00" sur la ligne "Pierre Chevalier"
		Alors je vois "Fait" sur la ligne "Pierre Chevalier"
		Alors je vois "1" sur la ligne "Pierre Chevalier"
