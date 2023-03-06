#language: fr

# TODO : à adapter
Fonctionnalité: Ajout de code ROME dans un carnet de bénéficiaire
	En tant que pro
	Je veux pouvoir modifier le code ROME d'un carnet

Scénario: Recherche correcte même avec des trous
	Soit le pro "pcamara@seinesaintdenis.fr" sur le carnet de "Beach"
	Quand je clique sur "Mettre à jour" sous le titre "Diagnostic socioprofessionnel"
	Alors je vois "Veuillez cliquer sur un champ pour le modifier"
	Quand je renseigne "Agent production" dans le champ "Emploi recherché"
	Alors je vois "Agent / Agente de production laitière (A1302)"
	Alors je vois "Agent / Agente de production de matériels électroniques"
	Quand je clique sur le texte "laitière (A1302)"
	Quand je clique sur le texte "Veuillez cliquer sur un champ pour le modifier."
	Alors je ne vois pas "Agent / Agente de production de matériels électroniques"
	Alors je vois "Agent / Agente de production laitière (A1302)"

Scénario: Ajout de plusieurs métiers
	Soit le pro "pcamara@seinesaintdenis.fr" sur le carnet de "Beach"
	Quand je clique sur "Mettre à jour" sous le titre "Diagnostic socioprofessionnel"
	Alors je vois "Veuillez cliquer sur un champ pour le modifier"
	Quand je renseigne "Agent production" dans le champ "Emploi recherché"
	Alors je vois "Agent / Agente de production laitière (A1302)"
	Alors je vois "Agent / Agente de production de matériels électroniques"
	Quand je clique sur le texte "laitière (A1302)"
	Quand je clique sur le texte "matériels électroniques"
	Quand je clique sur le texte "Veuillez cliquer sur un champ pour le modifier."
	Alors je vois "Agent / Agente de production de matériels électroniques"
	Alors je vois "Agent / Agente de production laitière (A1302)"
	Quand je clique sur "Enregistrer"
	Alors je vois "Agent / Agente de production laitière (A1302)"
	Alors je vois "Agent / Agente de production de matériels électroniques (H2604)"
