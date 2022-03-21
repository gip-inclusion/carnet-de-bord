#language: fr

@pro
Fonctionnalité: Information sur les axes de travail depuis un carnet
	En tant que pro
	Je veux avoir des informations sur les axes de travail du carnet

Scénario: Visibilité du nombre d'actions en cours pour chaque axe de travail
	Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
	Quand je clique sur "Axes de travail"
	Alors je vois "Difficultés administratives"
	Alors je vois "1 action"
	Alors je vois "Emploi"
	Alors je vois "4 actions"
	Alors je vois "Logement"
	Alors je vois "3 actions"
