#language: fr

Fonctionnalité: Création de carnet depuis l'api rdv-i
	Pour faciliter l'utilisation de rdv-i et carnet de bord
	Je veux pouvoir créer des carnet depuis une Api

Scénario: Créer un carnet
	Soit la creation du carnet de "Jay" "Randévoui" depuis l'api par "contact+cd51@carnetdebord.inclusion.beta.gouv.fr"
	Soit un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
	Quand je clique sur "Bénéficiaires"
	Quand je recherche "Jay"
	Quand je clique sur "Rechercher"
	Quand j'attends que le tableau "Liste des bénéficiaires" apparaisse
	Alors je vois "Jay" sur la ligne "Randévoui"
