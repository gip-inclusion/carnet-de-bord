#language: fr

Fonctionnalité: Gestion de professionnels d'un déploiement
	Pour pouvoir gérer les professionnels de la plateforme
	En tant que manager d'un déploiement
	Je veux pouvoir voir les professionnels et gérer leur activation

	Scénario: Liste des professionnels
		Soit un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "Professionnels"
		Quand j'attends que le tableau "Liste des professionnels" apparaisse
		Alors je vois "1" sur la ligne "Giulia DIABY"
		Alors je vois "0" sur la ligne "Blaise ALAISE"
		Alors je vois "DÉSACTIVÉ" sur la ligne "Sarah Vigote"

	Scénario: Validation d'un professionnel
		Soit un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "Professionnels"
		Quand j'attends que le tableau "Liste des professionnels" apparaisse
		Quand je clique sur "Valider"
		Quand j'attends 1 secondes
		Alors je vois "VALIDÉ" sur la ligne "Lejeune Bienvenu"
