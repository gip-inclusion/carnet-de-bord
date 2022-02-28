#language: fr

@pro
Fonctionnalité: Ajout de code ROME dans un carnet de bénéficiaire
	En tant que pro
	Je veux pouvoir modifier le code ROME d'un carnet

Scénario: Recherche correcte
	Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
	Quand je clique sur "Situation socioprofessionnelle"
	Quand je clique sur "Mettre à jour" sous le titre "Situation socioprofessionnelle"
	Alors je vois "Veuillez cliquer sur un champ pour le modifier"
	Quand je renseigne "A11" dans le champ "Emploi recherché"
	Alors je vois "Conductrice d'abatteuses (A1101)"
	Alors je vois "Conductrice de machines"
	Quand je clique sur le texte "Conductrice de machines"
	Alors je ne vois pas "Conductrice d'abatteuses (A1101)"
	Alors je vois "Conductrice de machines"
