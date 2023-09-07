#language: fr

Fonctionnalité: Consultation de la liste des bénéficiaires par un manager
	En tant que manager
	Je veux voir la liste des bénéficiaires

	Scénario: Voir la liste
		Soit un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Quand j'attends que le tableau "Liste des bénéficiaires" apparaisse
		Alors je vois la colonne "Date de naissance"
		Alors je vois "22/06/1996" sur la ligne "Lindsay"

	Scénario: Voir la liste des bénéficiaires d'un professionnel
		Soit un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "Professionnels"
		Quand je clique sur "liste des bénéficiaires de Pierre CHEVALIER"
		Alors je vois "pierre.chevalier@livry-gargan.fr"
		Alors je vois "Supprimer le filtre"
		Alors je vois "TIFOUR" dans le tableau "Liste des bénéficiaires"

	Scénario: Supprimer le filtre professionnel
		Soit un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "Professionnels"
		Quand je clique sur "liste des bénéficiaires de Pierre CHEVALIER"
		Quand je clique sur "Supprimer le filtre"
		Alors je ne vois pas "Supprimer le filtre"
		Alors je vois "AGUILAR" dans le tableau "Liste des bénéficiaires"

	Scénario: rechercher un bénéficiaire par préfixe
		Soit un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je recherche "gon"
		Quand je clique sur "Rechercher"
		Quand j'attends que le tableau "Liste des bénéficiaires" apparaisse
		Alors je vois "GÔNZALEZ" sur la ligne "Bolton"

	Scénario: rechercher un bénéficiaire par suffixe
		Soit un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "Bénéficiaires"
		Quand je recherche "alez"
		Quand je clique sur "Rechercher"
		Quand j'attends que le tableau "Liste des bénéficiaires" apparaisse
		Alors je vois "GÔNZALEZ" sur la ligne "Bolton"
