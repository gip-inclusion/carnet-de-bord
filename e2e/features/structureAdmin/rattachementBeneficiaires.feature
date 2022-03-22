#language: fr

@rattachement_beneficiaires
Fonctionnalité: Rattachement des bénéficiaires
	Pour permettre aux professionnels de gérer leurs bénéficiaires
	En tant qu'administrateur de structures
	Je veux pouvoir rattacher les bénéficiaires de ma strucutre aux pro correspondants

	Scénario: Import liste de rattachement
		Soit un "administrateur de structures" authentifié avec l'email "jacques.celaire@beta.gouv.fr"
		Soit un utilisateur sur la page "/structures/1c52e5ad-e0b9-48b9-a490-105a4effaaea"
		Alors je vois "Portefeuille de la structure"
		Quand je clique sur "Importer une liste de rattachement"
		Alors je vois "Rattacher des professionnels"
		Quand je télécharge en cliquant sur "télécharger la liste des bénéficiaires en attente de rattachement"
		Alors j'ai téléchargé le fichier "beneficiaires_en_attente.csv"
		Quand je téléverse le fichier "/resources/beneficiaires_en_attente.csv"
		Alors je vois "Vous allez importer le groupe de suivi suivant. Veuillez vérifier que les données sont correctes et confirmer."
		Alors je vois "1 rattachement sélectionné sur 1"
		Quand je clique sur "Confirmer"
		Alors je vois "1 rattachement importé sur 1 demandé."

