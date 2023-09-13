#language: fr

Fonctionnalité: Création de carnet depuis l'api rdv-i
	Pour faciliter l'utilisation de rdv-i et carnet de bord
	Je veux pouvoir créer des carnet depuis une Api

Scénario: Créer un carnet
	Soit la creation du carnet de "Jay" "RANDÉVOUI" dans le déploiement "expérimentation 51" depuis l'api par "contact+cd51@carnetdebord.inclusion.beta.gouv.fr"
	Soit un "administrateur de territoire" authentifié avec l'email "contact+cd51@carnetdebord.inclusion.beta.gouv.fr"
	Quand je clique sur "Bénéficiaires"
	Quand je recherche "ran"
	Quand je clique sur "Rechercher"
	Quand j'attends que le tableau "Liste des bénéficiaires" apparaisse
	Alors je vois "Jay" sur la ligne "RANDÉVOUI"
