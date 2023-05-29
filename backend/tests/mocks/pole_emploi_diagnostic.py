# ruff: noqa: E501

"""
Result for a call to:
TODO: change this when test data are available
"""
PE_API_RECHERCHE_USAGERS_RESULT_OK_MOCK = {
    "codeRetour": "S001",
    # "identifiant": "e1881749-1334-47b9-8a34-74922528d4ea#LQdESFx4KSZklOXWJGJ9yxWLdwqbKWx6dh-9FNc11S0Q4YjU6YhojWUqxyVTWvuk",
    "identifiant": "usager_identifiant",
    "message": "Approchant trouvé",
    "topIdentiteCertifiee": "O",
}


PE_API_CONTRAINTES_INDIVIDUS_RESULT_OK_MOCK = {
    "conseiller": "TNAN0260",
    "dateDeModification": "2023-05-12T12:54:39.000+00:00",
    "code": "7",
    "libelle": "Résoudre ses contraintes personnelles",
    "contraintes": [
        {
            "id": 23,
            "nom": "Développer sa mobilité",
            "valeur": "CLOTUREE",
            "date": "2023-05-12T12:54:39.000+00:00",
            "situations": [
                {
                    "code": "6",
                    "libelle": "Aucun moyen de transport à disposition",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "7",
                    "libelle": "Dépendant des transports en commun",
                    "valeur": "OUI",
                },
                {
                    "code": "8",
                    "libelle": "Permis non valide / suspension de permis",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "40",
                    "libelle": "État de santé incompatible avec la conduite",
                    "valeur": "NON_ABORDEE",
                },
            ],
            "objectifs": [
                {
                    "code": "4",
                    "libelle": "Faire un point complet sur sa mobilité",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "29",
                    "libelle": "Accéder à un véhicule",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "5",
                    "libelle": "Entretenir ou réparer son véhicule",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "6",
                    "libelle": "Obtenir le permis de conduire (code / conduite)",
                    "valeur": "REALISE",
                },
                {
                    "code": "7",
                    "libelle": "Trouver une solution de transport (hors acquisition ou entretien de véhicule)",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "30",
                    "libelle": "Travailler la mobilité psychologique",
                    "valeur": "NON_ABORDE",
                },
            ],
        },
        {
            "id": 24,
            "nom": "Surmonter ses contraintes familiales",
            "valeur": "NON_ABORDEE",
            "date": None,
            "situations": [
                {
                    "code": "9",
                    "libelle": "Enfant(s) en situation de handicap",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "10",
                    "libelle": "Contraintes horaires",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "11",
                    "libelle": "Aidant familial (s'occuper d'un proche)",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "12",
                    "libelle": "Autres contraintes familiales à prendre en compte",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "13",
                    "libelle": "Enfant(s) de moins de 3 ans sans solution de garde",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "14",
                    "libelle": "Attend un enfant ou plus",
                    "valeur": "NON_ABORDEE",
                },
            ],
            "objectifs": [
                {
                    "code": "8",
                    "libelle": "Faire face à la prise en charge d'une personne dépendante",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "9",
                    "libelle": "Trouver des solutions de garde d'enfant",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "10",
                    "libelle": "Surmonter des difficultés éducatives ou de parentalité",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "11",
                    "libelle": "Faire face à un conflit familial et/ou une séparation",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "31",
                    "libelle": "Obtenir le statut d'aidant familial",
                    "valeur": "NON_ABORDE",
                },
                {"code": "32", "libelle": "Rompre l'isolement", "valeur": "NON_ABORDE"},
            ],
        },
        {
            "id": 25,
            "nom": "Prendre en compte son état de santé",
            "valeur": "NON_ABORDEE",
            "date": None,
            "situations": [
                {
                    "code": "15",
                    "libelle": "Problème déclaré entravant l'exercice de certains métiers",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "16",
                    "libelle": "Couverture sociale / mutuelle à mettre à jour",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "17",
                    "libelle": "Problème déclaré ne permettant plus d'exercer une activité professionnelle",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "18",
                    "libelle": "Problème déclaré ne permettant pas de reprendre une activité professionnelle immédiate",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "19",
                    "libelle": "Problème déclaré entrainant des absences régulières",
                    "valeur": "NON_ABORDEE",
                },
            ],
            "objectifs": [
                {
                    "code": "13",
                    "libelle": "Bénéficier d'un accompagnement pour accéder aux droits et aux soins",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "33",
                    "libelle": "Travailler sur les comportements de santé (dépendances, hygiènes corporelles, dépistage, ...)",
                    "valeur": "NON_ABORDE",
                },
            ],
        },
        {
            "id": 26,
            "nom": "Développer ses capacités en lecture, écriture et calcul",
            "valeur": "CLOTUREE",
            "date": "2023-05-11T08:41:58.000+00:00",
            "situations": [
                {
                    "code": "20",
                    "libelle": "Non maitrise de l'écrit en français (écrit)",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "21",
                    "libelle": "Non maitrise de la lecture en français (lu)",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "22",
                    "libelle": "Non maitrise de la compréhension du français (parlé)",
                    "valeur": "NON_ABORDEE",
                },
                {"code": "23", "libelle": "Difficultés en calcul", "valeur": "OUI"},
            ],
            "objectifs": [
                {
                    "code": "16",
                    "libelle": "Apprendre / Améliorer ses capacités en français",
                    "valeur": "REALISE",
                },
                {
                    "code": "17",
                    "libelle": "Apprendre / Améliorer ses capacités en calcul",
                    "valeur": "REALISE",
                },
            ],
        },
        {
            "id": 27,
            "nom": "Faire face à des difficultés de logement",
            "valeur": "NON_ABORDEE",
            "date": None,
            "situations": [
                {
                    "code": "24",
                    "libelle": "Sans hébergement / rupture effective de logement",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "25",
                    "libelle": "Logement insalubre",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "26",
                    "libelle": "Difficulté à payer le loyer",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "27",
                    "libelle": "Doit quitter le logement",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "28",
                    "libelle": "Territoire rural isolé",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "41",
                    "libelle": "Besoin d'adapter le logement",
                    "valeur": "NON_ABORDEE",
                },
            ],
            "objectifs": [
                {
                    "code": "18",
                    "libelle": "Se maintenir dans le logement",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "35",
                    "libelle": "Réduire les impayés de loyer",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "19",
                    "libelle": "Rechercher une solution d'hébergement temporaire",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "36",
                    "libelle": "Accéder à un logement",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "20",
                    "libelle": "Changer de logement",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "37",
                    "libelle": "S'informer sur les démarches liées à l'accès au logement",
                    "valeur": "NON_ABORDE",
                },
            ],
        },
        {
            "id": 28,
            "nom": "Faire face à des difficultés financières",
            "valeur": "NON_ABORDEE",
            "date": None,
            "situations": [
                {
                    "code": "29",
                    "libelle": "Sans aucune ressource",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "30",
                    "libelle": "Baisse des ressources",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "31",
                    "libelle": "Difficulté dans la gestion d'un budget",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "32",
                    "libelle": "En situation de surendettement",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "33",
                    "libelle": "Besoin d'un soutien alimentaire",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "34",
                    "libelle": "Ressources précaires (inférieures au seuil de pauvreté)",
                    "valeur": "NON_ABORDEE",
                },
            ],
            "objectifs": [
                {
                    "code": "22",
                    "libelle": "Améliorer sa gestion budgétaire",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "23",
                    "libelle": "Faire face à une situation d'endettement / surendettement",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "39",
                    "libelle": "Acquérir une autonomie budgétaire",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "21",
                    "libelle": "Mettre en place une mesure de protection financières (tutelles, curatelles, ...)",
                    "valeur": "NON_ABORDE",
                },
            ],
        },
        {
            "id": 29,
            "nom": "Faire face à des difficultés administratives ou juridiques",
            "valeur": "NON_ABORDEE",
            "date": None,
            "situations": [
                {
                    "code": "35",
                    "libelle": "Difficultés à effectuer une démarche administrative",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "36",
                    "libelle": "Besoin d'etre guidé dans le cadre d'un accès aux droits",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "37",
                    "libelle": "Rencontre des difficultés juridiques",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "38",
                    "libelle": "Difficulté à accéder à un justificatif d'identité",
                    "valeur": "NON_ABORDEE",
                },
                {
                    "code": "39",
                    "libelle": "Difficulté à accéder à son avis d'imposition",
                    "valeur": "NON_ABORDEE",
                },
            ],
            "objectifs": [
                {
                    "code": "25",
                    "libelle": "Connaitre les voies de recours face à une discrimination",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "26",
                    "libelle": "Prendre en compte une problématique judiciaire",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "27",
                    "libelle": "Bénéficier d'un appui aux démarches administratives",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "28",
                    "libelle": "Bénéficier d'un accompagnement pour accéder aux droits",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "38",
                    "libelle": "Bénéficier d'une mesure d'accompagnement adapté",
                    "valeur": "NON_ABORDE",
                },
                {
                    "code": "40",
                    "libelle": "Bénéficier d'un accompagnement à l'accès à la citoyenneté",
                    "valeur": "NON_ABORDE",
                },
            ],
        },
    ],
}
