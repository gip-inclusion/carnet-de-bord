#language: fr

Fonctionnalité: Page d'accueil pro
	En tant que pro
	Je veux pouvoir consulter les informations importantes sur ma page d'accueil

Scénario: Accueil pro
	Soit le pro "pierre.chevalier@livry-gargan.fr" qui a cliqué sur le lien de connexion
	Alors je vois "Rechercher un bénéficiaire"

Scénario: Affichage des derniers carnet consultés
	Soit le pro "pierre.chevalier@livry-gargan.fr" qui a cliqué sur le lien de connexion
	Alors je vois "Sophie TIFOUR"

Scénario: Affichage de la liste de mes bénéficiaires
	Soit le pro "sanka@groupe-ns.fr" qui a cliqué sur le lien de connexion
	Alors je vois 3 lignes dans le tableau "Liste des bénéficiaires"
	Alors je vois "TIFOUR" dans le tableau "Liste des bénéficiaires"
	Alors je vois "HERRING" dans le tableau "Liste des bénéficiaires"
	Alors je vois "GALLEGOS" dans le tableau "Liste des bénéficiaires"

Scénario: Affichage du détail d'un carnet depuis la page d'accueil
	Soit le pro "sanka@groupe-ns.fr" qui a cliqué sur le lien de connexion
	Alors je clique sur "Voir le carnet de Winnie GALLEGOS"
	Alors je vois "winnie.gallegos@ut.com"
