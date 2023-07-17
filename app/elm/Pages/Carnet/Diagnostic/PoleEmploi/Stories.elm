module Pages.Carnet.Diagnostic.PoleEmploi.Stories exposing (main)

import Domain.PoleEmploi.ContraintePersonnelle as ContraintePersonnelle
import Effect
import GraphQL.Enum.PoleEmploiBesoinValeurEnum as PoleEmploiBesoinValeurEnum
import Pages.Carnet.Diagnostic.PoleEmploi.Page as Page
import Storybook.Component exposing (Component)
import Storybook.Controls


diagnostic : Page.Diagnostic
diagnostic =
    { dateDeModification = Nothing
    , contraintes =
        [ { theme = ContraintePersonnelle.MaitriseLangue
          , situations = [ "Difficultés en calcul" ]
          , objectifs = []
          }
        , { theme = ContraintePersonnelle.Mobilite
          , situations = [ "Dépendant des transports en commun", "Pas de permis B" ]
          , objectifs = [ "Faire un point complet sur sa mobilité" ]
          }
        ]
    , projetProfessionels =
        [ { nom = Just "Boulanger"
          , idMetierChiffre = "fab31b61-9b96-4112-afac-5020a79a21de#lkLOSn1Wty5XMfoSBOBxuTlzE4T9-wXxHUOv-yvI8lg"
          , dateDeMiseAJour = Nothing
          , besoins =
                [ { libelle = "Identifier ses points forts et ses compétences"
                  , valeur = PoleEmploiBesoinValeurEnum.PointFort
                  }
                , { libelle = "Connaître les opportunités d’emploi"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Découvrir un métier ou un secteur d’activité"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Confirmer son choix de métier"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Trouver sa formation"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Monter son dossier de formation"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Valoriser ses compétences"
                  , valeur = PoleEmploiBesoinValeurEnum.Besoin
                  }
                , { libelle = "Réaliser un CV et/ou une lettre de motivation"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Développer son réseau"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Organiser ses démarches de recherche d’emploi"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Répondre à des offres d’emploi"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Faire des candidatures spontanées"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Suivre ses candidatures et relancer les recruteurs"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Convaincre un recruteur en entretien"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Définir son projet de création d’entreprise"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Structurer son projet de création d’entreprise"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Développer son entreprise"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Connaître les opportunités d’emploi à l’étranger"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "S’informer sur les aides pour travailler à l’étranger"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "S’organiser suite à son retour en France"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                ]
          }
        , { nom = Nothing
          , idMetierChiffre = "fab31b61-9b96-4112-afac-5020a79a21de#AfHQJo0sNYlkv1pnqbqX6dav70Yoxh83N9tqmcJNoxY"
          , dateDeMiseAJour = Nothing
          , besoins =
                [ { libelle = "Identifier ses points forts et ses compétences"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Connaître les opportunités d’emploi"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Découvrir un métier ou un secteur d’activité"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Confirmer son choix de métier"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Trouver sa formation"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Monter son dossier de formation"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Valoriser ses compétences"
                  , valeur = PoleEmploiBesoinValeurEnum.Besoin
                  }
                , { libelle = "Réaliser un CV et/ou une lettre de motivation"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Développer son réseau"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Organiser ses démarches de recherche d’emploi"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Répondre à des offres d’emploi"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Faire des candidatures spontanées"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Suivre ses candidatures et relancer les recruteurs"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Convaincre un recruteur en entretien"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Définir son projet de création d’entreprise"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Structurer son projet de création d’entreprise"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Développer son entreprise"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "Connaître les opportunités d’emploi à l’étranger"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "S’informer sur les aides pour travailler à l’étranger"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                , { libelle = "S’organiser suite à son retour en France"
                  , valeur = PoleEmploiBesoinValeurEnum.NonExplore
                  }
                ]
          }
        ]
    }


testData : Page.Model
testData =
    Page.Success diagnostic


main : Component Page.Model Page.Msg
main =
    Storybook.Component.sandbox
        { controls = Storybook.Controls.none
        , init =
            ( testData, Cmd.none )
        , update = \msg model -> Page.update msg model |> Tuple.mapSecond Effect.perform
        , view =
            \_ -> Page.view
        }
