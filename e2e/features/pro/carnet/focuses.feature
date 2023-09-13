#language: fr

Fonctionnalité: Information sur les axes de travail depuis un carnet
	En tant que pro
	Je veux avoir des informations sur les axes de travail du carnet

Scénario: Visibilité du nombre d'actions en cours pour chaque axe de travail
	Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "TIFOUR"
	Alors je vois "1 action" dans la tuile "Difficultés administratives"
	Alors je vois "4 actions" dans la tuile "Emploi"
	Alors je vois "3 actions" dans la tuile "Logement"

Scénario: Ajout d'un axe de travail par un pro
	Soit le pro "sanka@groupe-ns.fr" sur le carnet de "GALLEGOS"
	Quand je clique sur "Ajouter un axe de travail"
	Alors j'attends que le texte "Axe de travail" apparaisse
	Quand je sélectionne l'option "Numérique" dans la liste "Thème"
	Quand je clique sur "Valider"
	Quand je clique sur "J'ai compris"
	Alors je vois "Aucune action" dans la tuile "Numérique"
	Alors je ne vois pas "J'ai compris"

Scénario: Je peux consulter un axe de travail existant
	Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "TIFOUR"
	Quand je clique sur "Logement" dans la tuile "Logement"
	Alors j'attends que le texte "Hébergé chez un tiers" apparaisse
	Quand je clique sur "Changer de logement"
	Alors j'attends que le texte "Action" apparaisse
	Alors je vois "Sarah VIGOTE" sur la ligne "Intervention face à une procédure expulsion"

Scénario: Ajout d'un objectif  par un pro
	Soit le pro membre "sanka@groupe-ns.fr" sur le carnet de "AGUILAR"
	Alors je clique sur "Formation" dans la tuile "Formation"
	Alors j'attends que le texte "Trouver sa formation" apparaisse
	Quand je clique sur "Ajouter un objectif"
	Alors j'attends que le texte "Objectif" apparaisse
	Quand je sélectionne l'option "Monter son dossier de formation" dans la liste "Objectif"
	Quand je choisis "Aucun"
	Quand je clique sur "Ajouter"
	Alors je vois "Monter son dossier de formation" sous le titre "Objectifs"
