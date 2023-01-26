#language: fr

Fonctionnalité: Modification d'un professionnel
	Pour pouvoir gérer plus facilement l'administration d'une structure
	En tant que gestionnaire de structure
	Je veux pouvoir modifier un professionnel

	Scénario: Modification d'un professionnel
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Quand je clique sur "Professionnels"
		Quand je clique sur "Mettre à jour" dans la ligne de "Blaise Alaise"
		Alors je renseigne "0612345678" dans le champ "Numéro de téléphone"
		Quand je clique sur "Enregistrer les modifications"
		Alors je vois "0612345678"

	Scénario: Modification des dispositifs d'orientation d'un professionnel
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Quand je clique sur "Professionnels"
		Quand je clique sur "Mettre à jour" dans la ligne de "Blaise Alaise"
		Quand je coche "RIA (Professionnel)"
		Quand je clique sur "Enregistrer les modifications"
		Quand je clique sur "Mettre à jour" dans la ligne de "Blaise Alaise"
		Alors l'option "RIA (Professionnel)" est sélectionnée

	Scénario: Modification des dispositifs d'orientation existants d'un professionnel
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Quand je clique sur "Professionnels"
		Quand je clique sur "Mettre à jour" dans la ligne de "Pierre Chevalier"
		Quand je décoche "Socio-professionnel"
		Quand je décoche "PE (Professionnel)"
		Quand je clique sur "Enregistrer les modifications"
		Quand je clique sur "Mettre à jour" dans la ligne de "Pierre Chevalier"
		Alors l'option "Socio-professionnel" n'est pas sélectionnée
		Alors l'option "PE (Professionnel)" n'est pas sélectionnée
