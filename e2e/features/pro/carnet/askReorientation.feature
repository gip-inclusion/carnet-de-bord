#language: fr

Fonctionnalité: Création d'une demande de réorientation
        Pour pouvoir accompagner l'évolution du parcours d'un bénéficiaire
        En tant que référent
        Je veux pouvoir demander la réorientation d'un bénéficiaire

        Scénario: demande de réorientation
                Soit le pro "pierre.chevalier@livry-gargan.fr" sur le carnet de "Tifour"
                Quand je clique sur "Demander une réorientation"
		Quand je renseigne "Réorientation requise" dans le champ "Motif de demande de réorienttion"
                Quand je sélectionne l'option "Social" dans la liste "Orientation recommandée"
                Quand je clique sur "Envoyer ma demande"
                Quand je clique sur "Envoyer ma demande"
		Alors je vois "Demande de réorientation envoyée"
