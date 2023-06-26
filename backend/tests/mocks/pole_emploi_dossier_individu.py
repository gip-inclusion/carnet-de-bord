import json

DOSSIER_INDIVIDU = json.loads(
    """{
  "besoinsParDiagnosticIndividuDtos": [
    {
      "idMetierChiffre": "fab31b61-9b96-4112-afac-5020a79a21de#lkLOSn1Wty5XMfoSBOBxuTlzE4T9-wXxHUOv-yvI8lg",
      "nomMetier": "Boulanger",
      "typologie": "métier recherché",
      "statut": "EN_COURS",
      "estPrioritaire": false,
      "dateMiseAJour": "2022-12-08T23:00:00.000+00:00",
      "besoins": [
        {
          "code": "1",
          "libelle": "Identifier ses points forts et ses compétences",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "2",
          "libelle": "Connaître les opportunités d’emploi",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "3",
          "libelle": "Découvrir un métier ou un secteur d’activité",
          "valeur": "BESOIN"
        },
        {
          "code": "4",
          "libelle": "Confirmer son choix de métier",
          "valeur": "POINT_FORT"
        },
        {
          "code": "5",
          "libelle": "Trouver sa formation",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "6",
          "libelle": "Monter son dossier de formation",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "8",
          "libelle": "Valoriser ses compétences",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "9",
          "libelle": "Réaliser un CV et/ou une lettre de motivation",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "10",
          "libelle": "Développer son réseau",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "11",
          "libelle": "Organiser ses démarches de recherche d’emploi",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "12",
          "libelle": "Répondre à des offres d’emploi",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "13",
          "libelle": "Faire des candidatures spontanées",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "14",
          "libelle": "Suivre ses candidatures et relancer les recruteurs",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "15",
          "libelle": "Convaincre un recruteur en entretien",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "16",
          "libelle": "Définir son projet de création d’entreprise",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "17",
          "libelle": "Structurer son projet de création d’entreprise",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "18",
          "libelle": "Développer son entreprise",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "19",
          "libelle": "Connaître les opportunités d’emploi à l’étranger",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "20",
          "libelle": "S’informer sur les aides pour travailler à l’étranger",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "21",
          "libelle": "S’organiser suite à son retour en France",
          "valeur": "NON_EXPLORE"
        }
      ]
    },
    {
      "idMetierChiffre": "fab31b61-9b96-4112-afac-5020a79a21de#AfHQJo0sNYlkv1pnqbqX6dav70Yoxh83N9tqmcJNoxY",
      "nomMetier": "Boulanger",
      "typologie": "métier recherché",
      "statut": "EN_COURS",
      "estPrioritaire": false,
      "dateMiseAJour": "2022-12-08T23:00:00.000+00:00",
      "besoins": [
        {
          "code": "1",
          "libelle": "Identifier ses points forts et ses compétences",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "2",
          "libelle": "Connaître les opportunités d’emploi",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "3",
          "libelle": "Découvrir un métier ou un secteur d’activité",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "4",
          "libelle": "Confirmer son choix de métier",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "5",
          "libelle": "Trouver sa formation",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "6",
          "libelle": "Monter son dossier de formation",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "8",
          "libelle": "Valoriser ses compétences",
          "valeur": "BESOIN"
        },
        {
          "code": "9",
          "libelle": "Réaliser un CV et/ou une lettre de motivation",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "10",
          "libelle": "Développer son réseau",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "11",
          "libelle": "Organiser ses démarches de recherche d’emploi",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "12",
          "libelle": "Répondre à des offres d’emploi",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "13",
          "libelle": "Faire des candidatures spontanées",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "14",
          "libelle": "Suivre ses candidatures et relancer les recruteurs",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "15",
          "libelle": "Convaincre un recruteur en entretien",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "16",
          "libelle": "Définir son projet de création d’entreprise",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "17",
          "libelle": "Structurer son projet de création d’entreprise",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "18",
          "libelle": "Développer son entreprise",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "19",
          "libelle": "Connaître les opportunités d’emploi à l’étranger",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "20",
          "libelle": "S’informer sur les aides pour travailler à l’étranger",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "21",
          "libelle": "S’organiser suite à son retour en France",
          "valeur": "NON_EXPLORE"
        }
      ]
    },
    {
      "idMetierChiffre": "fab31b61-9b96-4112-afac-5020a79a21de#aFE92cIQzZQ0mLsAK4icj-acS5WpmO_Q-5CR6_FwBGM",
      "nomMetier": null,
      "typologie": null,
      "statut": "EN_COURS",
      "estPrioritaire": false,
      "dateMiseAJour": "2022-12-14T23:00:00.000+00:00",
      "besoins": [
        {
          "code": "1",
          "libelle": "Identifier ses points forts et ses compétences",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "2",
          "libelle": "Connaître les opportunités d’emploi",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "3",
          "libelle": "Découvrir un métier ou un secteur d’activité",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "4",
          "libelle": "Confirmer son choix de métier",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "5",
          "libelle": "Trouver sa formation",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "6",
          "libelle": "Monter son dossier de formation",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "8",
          "libelle": "Valoriser ses compétences",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "9",
          "libelle": "Réaliser un CV et/ou une lettre de motivation",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "10",
          "libelle": "Développer son réseau",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "11",
          "libelle": "Organiser ses démarches de recherche d’emploi",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "12",
          "libelle": "Répondre à des offres d’emploi",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "13",
          "libelle": "Faire des candidatures spontanées",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "14",
          "libelle": "Suivre ses candidatures et relancer les recruteurs",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "15",
          "libelle": "Convaincre un recruteur en entretien",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "16",
          "libelle": "Définir son projet de création d’entreprise",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "17",
          "libelle": "Structurer son projet de création d’entreprise",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "18",
          "libelle": "Développer son entreprise",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "19",
          "libelle": "Connaître les opportunités d’emploi à l’étranger",
          "valeur": "POINT_FORT"
        },
        {
          "code": "20",
          "libelle": "S’informer sur les aides pour travailler à l’étranger",
          "valeur": "NON_EXPLORE"
        },
        {
          "code": "21",
          "libelle": "S’organiser suite à son retour en France",
          "valeur": "NON_EXPLORE"
        }
      ]
    }
  ],
  "contraintesIndividusDto": {
    "conseiller": "ecse0201",
    "dateDeModification": "2021-05-17T14:47:11.000+00:00",
    "code": "7",
    "libelle": "Résoudre ses contraintes personnelles",
    "contraintes": [
      {
        "code": "23",
        "libelle": "Développer sa mobilité",
        "valeur": "OUI",
        "date": "2021-05-17T14:47:11.000+00:00",
        "situations": [
          {
            "code": "6",
            "libelle": "Aucun moyen de transport à disposition",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "7",
            "libelle": "Dépendant des transports en commun",
            "valeur": "OUI"
          },
          {
            "code": "8",
            "libelle": "Permis non valide / suspension de permis",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "40",
            "libelle": "État de santé incompatible avec la conduite",
            "valeur": "NON_ABORDEE"
          }
        ],
        "objectifs": [
          {
            "code": "25",
            "libelle": "Faire un point complet sur sa mobilité",
            "valeur": "EN_COURS"
          },
          {
            "code": "26",
            "libelle": "Accéder à un véhicule",
            "valeur": "EN_COURS"
          },
          {
            "code": "27",
            "libelle": "Entretenir ou réparer son véhicule",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "28",
            "libelle": "Obtenir le permis de conduire (code / conduite)",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "29",
            "libelle": "Trouver une solution de transport (hors acquisition ou entretien de véhicule)",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "30",
            "libelle": "Travailler la mobilité psychologique",
            "valeur": "NON_ABORDE"
          }
        ]
      },
      {
        "code": "24",
        "libelle": "Surmonter ses contraintes familiales",
        "valeur": "NON_ABORDEE",
        "date": null,
        "situations": [
          {
            "code": "9",
            "libelle": "Enfant(s) en situation de handicap",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "10",
            "libelle": "Contraintes horaires",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "11",
            "libelle": "Aidant familial (s'occuper d'un proche)",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "12",
            "libelle": "Autres contraintes familiales à prendre en compte",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "13",
            "libelle": "Enfant(s) de moins de 3 ans sans solution de garde",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "14",
            "libelle": "Attend un enfant ou plus",
            "valeur": "NON_ABORDEE"
          }
        ],
        "objectifs": [
          {
            "code": "1",
            "libelle": "Faire face à la prise en charge d'une personne dépendante",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "2",
            "libelle": "Trouver des solutions de garde d'enfant",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "3",
            "libelle": "Surmonter des difficultés éducatives ou de parentalité",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "4",
            "libelle": "Faire face à un conflit familial et/ou une séparation",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "5",
            "libelle": "Obtenir le statut d'aidant familial",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "6",
            "libelle": "Rompre l'isolement",
            "valeur": "NON_ABORDE"
          }
        ]
      },
      {
        "code": "25",
        "libelle": "Prendre en compte son état de santé",
        "valeur": "NON_ABORDEE",
        "date": null,
        "situations": [
          {
            "code": "15",
            "libelle": "Problème déclaré entravant l'exercice de certains métiers",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "16",
            "libelle": "Couverture sociale / mutuelle à mettre à jour",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "17",
            "libelle": "Problème déclaré ne permettant plus d'exercer une activité professionnelle",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "18",
            "libelle": "Problème déclaré ne permettant pas de reprendre une activité professionnelle immédiate",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "19",
            "libelle": "Problème déclaré entrainant des absences régulières",
            "valeur": "NON_ABORDEE"
          }
        ],
        "objectifs": [
          {
            "code": "31",
            "libelle": "Bénéficier d'un accompagnement pour accéder aux droits et aux soins",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "32",
            "libelle": "Travailler sur les comportements de santé (dépendances, hygiènes corporelles, dépistage, ...)",
            "valeur": "NON_ABORDE"
          }
        ]
      },
      {
        "code": "26",
        "libelle": "Développer ses capacités en lecture, écriture et calcul",
        "valeur": "OUI",
        "date": "2021-05-17T14:47:11.000+00:00",
        "situations": [
          {
            "code": "20",
            "libelle": "Non maitrise de l'écrit en français (écrit)",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "21",
            "libelle": "Non maitrise de la lecture en français (lu)",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "22",
            "libelle": "Non maitrise de la compréhension du français (parlé)",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "23",
            "libelle": "Difficultés en calcul",
            "valeur": "OUI"
          }
        ],
        "objectifs": [
          {
            "code": "23",
            "libelle": "Apprendre / Améliorer ses capacités en français ",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "24",
            "libelle": "Apprendre / Améliorer ses capacités en calcul",
            "valeur": "NON_ABORDE"
          }
        ]
      },
      {
        "code": "27",
        "libelle": "Faire face à des difficultés de logement",
        "valeur": "NON_ABORDEE",
        "date": null,
        "situations": [
          {
            "code": "24",
            "libelle": "Sans hébergement / rupture effective de logement",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "25",
            "libelle": "Logement insalubre",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "26",
            "libelle": "Difficulté à payer le loyer",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "27",
            "libelle": "Doit quitter le logement",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "28",
            "libelle": "Territoire rural isolé",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "41",
            "libelle": "Besoin d'adapter le logement",
            "valeur": "NON_ABORDEE"
          }
        ],
        "objectifs": [
          {
            "code": "17",
            "libelle": "Se maintenir dans le logement",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "18",
            "libelle": "Réduire les impayés de loyer",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "19",
            "libelle": "Rechercher une solution d'hébergement temporaire ",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "20",
            "libelle": "Accéder à un logement",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "21",
            "libelle": "Changer de logement",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "22",
            "libelle": "S'informer sur les démarches liées à l'accès au logement",
            "valeur": "NON_ABORDE"
          }
        ]
      },
      {
        "code": "28",
        "libelle": "Faire face à des difficultés financières",
        "valeur": "NON_ABORDEE",
        "date": null,
        "situations": [
          {
            "code": "29",
            "libelle": "Sans aucune ressource",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "30",
            "libelle": "Baisse des ressources",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "31",
            "libelle": "Difficulté dans la gestion d'un budget",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "32",
            "libelle": "En situation de surendettement",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "33",
            "libelle": "Besoin d'un soutien alimentaire",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "34",
            "libelle": "Ressources précaires (inférieures au seuil de pauvreté)",
            "valeur": "NON_ABORDEE"
          }
        ],
        "objectifs": [
          {
            "code": "13",
            "libelle": "Améliorer sa gestion budgétaire",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "14",
            "libelle": "Faire face à une situation d'endettement / surendettement",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "15",
            "libelle": "Acquérir une autonomie budgétaire",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "16",
            "libelle": "Mettre en place une mesure de protection financières (tutelles, curatelles, ...)",
            "valeur": "NON_ABORDE"
          }
        ]
      },
      {
        "code": "29",
        "libelle": "Faire face à des difficultés administratives ou juridiques",
        "valeur": "NON_ABORDEE",
        "date": null,
        "situations": [
          {
            "code": "35",
            "libelle": "Difficultés à effectuer une démarche administrative",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "36",
            "libelle": "Besoin d'etre guidé dans le cadre d'un accès aux droits",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "37",
            "libelle": "Rencontre des difficultés juridiques",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "38",
            "libelle": "Difficulté à accéder à un justificatif d'identité",
            "valeur": "NON_ABORDEE"
          },
          {
            "code": "39",
            "libelle": "Difficulté à accéder à son avis d'imposition",
            "valeur": "NON_ABORDEE"
          }
        ],
        "objectifs": [
          {
            "code": "7",
            "libelle": "Connaitre les voies de recours face à une discrimination",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "8",
            "libelle": "Prendre en compte une problématique judiciaire",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "9",
            "libelle": "Bénéficier d'un appui aux démarches administratives",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "10",
            "libelle": "Bénéficier d'un accompagnement pour accéder aux droits",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "11",
            "libelle": "Bénéficier d'une mesure d'accompagnement adapté",
            "valeur": "NON_ABORDE"
          },
          {
            "code": "12",
            "libelle": "Bénéficier d'un accompagnement à l'accès à la citoyenneté",
            "valeur": "NON_ABORDE"
          }
        ]
      }
    ]
  }
}

"""  # noqa: E501
)
