#language: fr

Fonctionnalité: Accès en lecture seule à un carnet dont je ne suis pas membre
	En tant que pro
	Je veux uniquement voir les informations personnelles et le groupe de suivi du bénificiaire

	Scénario: Accès au carnet
		Soit le pro "pierre.chevalier@livry-gargan.fr" qui a cliqué sur le lien de connexion
		Alors je vois "Rechercher un bénéficiaire"
		Quand je renseigne "myrna" dans le champ "Rechercher un bénéficiaire"
		Quand je clique sur "Rechercher"
		Alors je clique sur "Voir le carnet de Myrna Henderson"
		Alors j'attends que le texte "Myrna Henderson" apparaisse
		Alors je ne vois pas "Plan d'action"
		Alors je ne vois pas "Diagnostic socioprofessionnel"

	Scénario: Se rattacher au carnet
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Henderson"
		Alors j'attends que le texte "Myrna Henderson" apparaisse
		Alors je clique sur "Se rattacher"
		Alors je vois "Bénéficiez-vous d'un mandat d'orientation en la qualité de référent ?"
		Alors je clique sur "Non"
		Alors je clique sur "Se rattacher" dans la modale
		Alors je vois "Pierre Chevalier" sous le titre "Groupe de suivi"
		Alors je ne vois pas "Référent"
		Alors je vois "Plan d'action"
		Alors je vois "Diagnostic socioprofessionnel"
		Alors je vois "Historique de parcours"

	Scénario: Se rattacher au carnet en tant que référent
		Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Henderson"
		Alors j'attends que le texte "Myrna Henderson" apparaisse
		Alors je clique sur "Se rattacher"
		Alors je vois "Bénéficiez-vous d'un mandat d'orientation en la qualité de référent ?"
		Alors je clique sur "Oui"
		Quand je sélectionne l'option "Professionnel" dans la liste "Dispositif d’accompagnement"
		Alors je clique sur "Se rattacher" dans la modale
		Alors je vois "Pierre Chevalier" sous le titre "Groupe de suivi"
		Alors je vois "Référent Professionnel"
		Alors je vois "Plan d'action"
		Alors je vois "Diagnostic socioprofessionnel"
		Alors je vois "Historique de parcours"
