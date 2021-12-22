#language: fr

@inscription
Fonctionnalité: Inscription
	Pour pouvoir utiliser le carnet de bord
	En tant que Professionnel
	Je veux pouvoir m'inscrire

Scénario:
	Soit un utilisateur sur la page "/inscription"
	Alors je vois "Inscription au Carnet de bord"
	# hack @lionelb on devrait utiliser le label
	Quand je renseigne "AF" dans le champ "Sélectionnez votre structure"
	Quand j'appuie sur Entrée
	# Quand je selectionne l'option "AFPA" dans la liste "structure"
	Alors je vois "Informations personnelles"
	Quand je renseigne "bob" dans le champ "Prénom"
	Quand je renseigne "slaigue" dans le champ "Nom"
	Quand je renseigne "bs@afpa.fr" dans le champ "Courriel"
	Quand je renseigne "0987654321" dans le champ "Téléphone"
	Quand je renseigne "Conseiller" dans le champ "Fonction"
	Quand je clique sur "Je valide mon inscription"
	Alors je vois "Demande d'inscription envoyée"
