#language: fr

Fonctionnalité: Ajout et modification d'un gestionnaire de structure
	Pour pouvoir gérer plus facilement l'administration d'une structure
	En tant que gestionnaire de structure
	Je veux pouvoir ajouter et/ou modifier un gestionnaire de structure

	Scénario: Ajout d'un gestionnaire de structure
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Alors je vois "Jacques Célaire"
		Quand je clique sur "Ajouter un gestionnaire"
		Alors je renseigne "mauricette.leblanc@cd93.fr" dans le champ "Courriel"
		Alors je renseigne "Mauricette" dans le champ "Prénom"
		Alors je renseigne "Leblanc" dans le champ "Nom"
		Quand je clique sur "Ajouter"
		Alors je vois "Mauricette Leblanc"

	Scénario: Modification d'un gestionnaire de structure
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@livry-gargan.fr"
		Quand je clique sur "Centre Communal d'action social Livry-Gargan"
		Quand je clique sur "Ajouter un gestionnaire"
		Alors je renseigne "mauricette.leblanc@cd93.fr" dans le champ "Courriel"
		Alors je renseigne "Mauricette" dans le champ "Prénom"
		Alors je renseigne "Leblanc" dans le champ "Nom"
		Quand je clique sur "Ajouter"
  	Alors je vois "Mauricette Leblanc"
		Quand je clique sur "Mettre à jour" dans la tuile "Mauricette Leblanc"
		Alors je vois "mauricette.leblanc@cd93.fr" dans le champ "Courriel"
		Alors je vois "Mauricette" dans le champ "Prénom"
		Alors je vois "Leblanc" dans le champ "Nom"
		Alors je renseigne "0612345678" dans le champ "Numéros de téléphone"
		Quand je clique sur "Enregistrer les modifications"
		Alors je vois "06 12 34 56 78" dans la tuile "Mauricette Leblanc"
