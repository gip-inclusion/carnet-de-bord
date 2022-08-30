#language: fr

@add_admin_structure
Fonctionnalité: Ajout d'un gestionnaire de structure
	Pour pouvoir gérer plus facilement l'administration d'une structure
	En tant que gestionnaire de structure
	Je veux pouvoir rajouter un gestionnaire de structure

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
