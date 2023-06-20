#language: fr

Fonctionnalité: Information sur les axes de travail depuis un carnet
	En tant que chargé d'orientation
	Je veux avoir des informations sur les axes de travail du carnet

Scénario: Ajout d'un axe de travail
	Soit le chargé d'orientation assigné "giulia.diaby@cd93.fr" sur le carnet de "Aguilar"
	Quand je clique sur "Ajouter un axe de travail"
	Alors j'attends que le texte "Axe de travail" apparaisse
	Quand je choisis "Aucun"
	Quand je sélectionne l'option "Emploi" dans la liste "Thème"
	Quand je clique sur "Valider"
	Quand je clique sur "J'ai compris"
	Alors je vois "Aucune action" dans la tuile "Emploi"

Scénario: Ajout d'un objectif
	Soit le chargé d'orientation assigné "giulia.diaby@cd93.fr" sur le carnet de "Aguilar"
	Alors je clique sur "Formation" dans la tuile "Formation"
	Alors j'attends que le texte "Trouver sa formation" apparaisse
	Quand je clique sur "Ajouter un objectif"
	Alors j'attends que le texte "Objectif" apparaisse
	Quand je sélectionne l'option "Monter son dossier de formation" dans la liste "Objectif"
	Quand je clique sur "Ajouter"
	Alors je vois "Monter son dossier de formation" sous le titre "Objectifs"

Scénario: Ajout d'une action
	Soit le chargé d'orientation assigné "giulia.diaby@cd93.fr" sur le carnet de "Aguilar"
	Alors je clique sur "Formation" dans la tuile "Formation"
	Alors j'attends que le texte "Trouver sa formation" apparaisse
	Quand je clique sur "Trouver sa formation"
	Alors j'attends que le texte "Action" apparaisse
	Alors je vois "Aucune action entreprise pour le moment." dans le volet
	Quand je clique sur "Sélectionner une action"
	Quand je renseigne "Atelier cv" dans le champ "Rechercher une action"
	Quand je clique sur la suggestion "Atelier CV"
	Quand je renseigne la date "30/05/2023" dans le champ "Date de début"
	Quand je clique sur "Ajouter"
	Alors je vois "Atelier CV" dans le tableau "Actions en cours"
	Quand je ferme le volet
	Alors je vois "1 action" dans la tuile "Formation"


Scénario: Ajout d'une action en double
	Soit le chargé d'orientation assigné "giulia.diaby@cd93.fr" sur le carnet de "Aguilar"
	Alors je clique sur "Formation" dans la tuile "Formation"
	Alors j'attends que le texte "Trouver sa formation" apparaisse
	Quand je clique sur "Trouver sa formation"
	Alors j'attends que le texte "Action" apparaisse
	Alors je vois "Aucune action entreprise pour le moment." dans le volet
	Quand je clique sur "Sélectionner une action"
	Quand je renseigne "Atelier cv" dans le champ "Rechercher une action"
	Quand je clique sur la suggestion "Atelier CV"
	Quand je renseigne la date "30/05/2023" dans le champ "Date de début"
	Quand je clique sur "Ajouter"
	Alors je vois "Atelier CV" dans le tableau "Actions en cours"
	Quand je ferme le volet
	Alors je vois "1 action" dans la tuile "Formation"
	Alors je clique sur "Formation" dans la tuile "Formation"
	Alors j'attends que le texte "Trouver sa formation" apparaisse
	Quand je clique sur "Trouver sa formation"
	Alors j'attends que le texte "Action" apparaisse
	Quand je clique sur "Sélectionner une action"
	Quand je renseigne "Atelier cv" dans le champ "Rechercher une action"
	Quand je clique sur la suggestion "Atelier CV"
	Quand je renseigne la date "30/05/2023" dans le champ "Date de début"
	Quand je clique sur "Ajouter"
	Alors je vois "Atelier CV" dans le tableau "Actions en cours"
	Quand je ferme le volet
	Alors je vois "2 actions" dans la tuile "Formation"
