#language: fr

@validation_intervenant_groupe_de_suivi
Fonctionnalité: Validation de la création d'un compte d'intervenant
        Pour pouvoir ajouter de nouveaux professionnels à la plateforme
        En tant que manager d'un déploiement
        Je veux pouvoir valider l'inscription d'un nouveau professionnel

        Scénario: Validation d'un professionnel
		Soit un "administrateur pdi" authentifié avec l'email "support.carnet-de-bord+cd93@fabrique.social.gouv.fr"
		Quand je clique sur "Professionnels"
		Quand j'attends que la table "Liste des professionnels" apparaisse
		Quand je clique sur "Activer"
		Quand j'attends 1 secondes
		Alors je vois "Actif" sur la ligne "Bienvenu"
