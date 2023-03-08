#language: fr

Fonctionnalité: Modification des dispositifs d'accompagnement d'une structure
	Pour pouvoir orienter les bénéficiaires vers les structures / professionnels adéquats
	En tant que manager
	Je veux pouvoir modifier les dispositifs d'accompagnement d'une structure

	Scénario: Mise à jour des dispositifs d'accompagnement d'une structure
		Soit un "administrateur de structures" authentifié avec l'email "vincent.timaitre@groupe-ns.fr"
		Quand je clique sur "Groupe NS"
		Quand je clique sur "Professionnel"
		Quand je clique sur "Mettre à jour" dans la ligne de "Simon Anka"
		Quand je coche "Social"
		Quand je clique sur "Enregistrer les modifications"
		Quand je clique sur "Mettre à jour" dans la ligne de "Simon Anka"
		Alors l'option "Social" est sélectionnée
		Quand un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "Structures"
		Quand je clique sur "Éditer la structure Groupe NS"
    Alors je décoche "Social"
		Quand je clique sur "Enregistrer les modifications"
		Alors je ne vois pas "Social" sur la ligne "Groupe NS"
		Quand un "administrateur de structures" authentifié avec l'email "vincent.timaitre@groupe-ns.fr"
		Quand je clique sur "Groupe NS"
		Quand je clique sur "Professionnel"
		Quand je clique sur "Mettre à jour" dans la ligne de "Simon Anka"
		Alors je ne vois pas "Social"

	Scénario: La mise à jour des dispositifs d'accompagnement d'une structure n'impacte pas les autres structures
		Soit un "administrateur de structures" authentifié avec l'email "vincent.timaitre@groupe-ns.fr"
		Quand je clique sur "Groupe NS"
		Quand je clique sur "Professionnel"
		Quand je clique sur "Mettre à jour" dans la ligne de "Simon Anka"
		Quand je coche "Social"
		Quand je clique sur "Enregistrer les modifications"
		Quand je clique sur "Mettre à jour" dans la ligne de "Simon Anka"
		Alors l'option "Social" est sélectionnée
		Quand un "administrateur de territoire" authentifié avec l'email "contact+cd93@carnetdebord.inclusion.beta.gouv.fr"
		Quand je clique sur "Structures"
		Quand je clique sur "Éditer la structure Interlogement 93"
    Alors je décoche "Social"
		Quand je clique sur "Enregistrer les modifications"
		Alors je ne vois pas "Social" sur la ligne "Interlogement 93"
		Quand un "administrateur de structures" authentifié avec l'email "vincent.timaitre@groupe-ns.fr"
		Quand je clique sur "Groupe NS"
		Quand je clique sur "Professionnel"
		Quand je clique sur "Mettre à jour" dans la ligne de "Simon Anka"
		Alors l'option "Social" est sélectionnée
