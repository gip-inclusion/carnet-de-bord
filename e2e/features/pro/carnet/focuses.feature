#language: fr

Fonctionnalité: Information sur les axes de travail depuis un carnet
	En tant que pro
	Je veux avoir des informations sur les axes de travail du carnet

Scénario: Visibilité du nombre d'actions en cours pour chaque axe de travail
	Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
	Quand je clique sur "Plan d'action"
	Alors je vois "1 action" dans la tuile "Difficultés administratives"
	Alors je vois "4 actions" dans la tuile "Emploi"
	Alors je vois "2 actions" dans la tuile "Logement"
