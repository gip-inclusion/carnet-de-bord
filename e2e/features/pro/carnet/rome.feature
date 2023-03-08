#language: fr

# TODO : à adapter
Fonctionnalité: Ajout de projet professionnel dans le carnet d'un bénéficiaire
	En tant que pro
	Je veux pouvoir modifier le code ROME d'un carnet

Scénario: Recherche de métier même avec des trous
	Soit le pro "pcamara@seinesaintdenis.fr" sur le carnet de "Beach"
	Quand je clique sur "Mettre à jour" sous le titre "Diagnostic socioprofessionnel"
	Quand je clique sur "Ajouter un projet professionnel"
	Quand je clique sur "Projet en construction"
	Quand je renseigne "dev info" dans le champ "Rechercher un métier ou un code ROME"
	Alors je vois "Développeur / Développeuse informatique (M1805)"
	Alors je vois "Ingénieur / Ingénieure de développement informatique (M1805)"
	Quand je clique sur le texte "Développeur / Développeuse informatique (M1805)"
	Alors je ne vois pas "Ingénieur / Ingénieure de développement informatique (M1805)"
	Alors je vois "Développeur / Développeuse informatique (M1805)"

Scénario: Ajout de plusieurs projet pro
	Soit le pro "pcamara@seinesaintdenis.fr" sur le carnet de "Beach"
	Quand je clique sur "Mettre à jour" sous le titre "Diagnostic socioprofessionnel"
	Quand je renseigne "15" dans le champ "Rayon de mobilité" après le texte "Formateur / Formatrice (K2111)"
	Quand je clique sur "Ajouter un projet professionnel"
	Quand je clique sur "Projet en construction"
	Quand je renseigne "dev info" dans le champ "Rechercher un métier ou un code ROME"
	Alors je vois "Développeur / Développeuse informatique (M1805)"
	Quand je clique sur le texte "Développeur / Développeuse informatique (M1805)"
	Quand je renseigne "100" dans le champ "Rayon de mobilité" après le texte "Développeur / Développeuse informatique (M1805)"
	Quand je clique sur "Enregistrer"
	Alors je vois "15" après le texte "Formateur / Formatrice (K2111)"
	Alors je vois "100" après le texte "Développeur / Développeuse informatique (M1805)"
