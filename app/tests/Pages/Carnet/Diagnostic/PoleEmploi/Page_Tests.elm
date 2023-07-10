module Pages.Carnet.Diagnostic.PoleEmploi.Page_Tests exposing (PageTest, suite)

import Effect exposing (Effect)
import Expect
import Extra.ProgramTest
import GraphQL.Enum.PoleEmploiBesoinValeurEnum as PoleEmploiBesoinValeurEnum
import GraphQL.Enum.PoleEmploiContrainteValeurEnum as PoleEmploiContrainteValeurEnum
import GraphQL.Enum.PoleEmploiObjectifValeurEnum as PoleEmploiObjectifValeurEnum
import GraphQL.Enum.PoleEmploiSituationValeurEnum as PoleEmploiSituationValeurEnum
import Html.Attributes as Attr
import Http
import Pages.Carnet.Diagnostic.PoleEmploi.GetDiagnosticPE exposing (GetDiagnosticPEQuery_root)
import Pages.Carnet.Diagnostic.PoleEmploi.Page as PoleEmploiPage
import ProgramTest
import SimulatedEffect.Cmd
import SimulatedEffect.Task
import Test exposing (..)
import Test.Html.Query as Query
import Test.Html.Selector as Selector


suite : Test
suite =
    describe "Diagnostic.PoleEmploi Page"
        [ test "displays an error when the graphql request fails" <|
            \_ ->
                startPage
                    { dossierIndividu = Err <| Http.BadBody "oops" }
                    |> Extra.ProgramTest.expectView
                        [ expectSeeText "Erreur lors de la récupération du diagnostic"
                        ]
        , test "shows an alert when there is no dossier individu for beneficiary" <|
            \_ ->
                startPage
                    { dossierIndividu = Ok <| { diagnostic_pole_emploi = Nothing }
                    }
                    |> Extra.ProgramTest.expectView [ expectSeeText "Diagnostic France Travail", expectSeeText "Aucun dossier France Travail trouvé" ]
        , test "shows contraintes" <|
            \_ ->
                startPage
                    { dossierIndividu =
                        Ok
                            { diagnostic_pole_emploi =
                                Just
                                    { besoinsParDiagnosticIndividuDtos =
                                        [ { nomMetier = Just "Boulanger"
                                          , idMetierChiffre = "123"
                                          , statut = "EN_COURS"
                                          , dateMiseAJour = Nothing
                                          , besoins =
                                                [ { libelle = "Se former"
                                                  , valeur = PoleEmploiBesoinValeurEnum.PointFort
                                                  }
                                                ]
                                          }
                                        ]
                                    , contraintesIndividusDto =
                                        { dateDeModification = Nothing
                                        , contraintes =
                                            [ { libelle = "Développer sa mobilité"
                                              , valeur = PoleEmploiContrainteValeurEnum.Oui
                                              , objectifs =
                                                    [ { libelle = "objectif 1", valeur = PoleEmploiObjectifValeurEnum.EnCours }
                                                    ]
                                              , situations =
                                                    [ { libelle = "situation 1", valeur = PoleEmploiSituationValeurEnum.Oui }
                                                    , { libelle = "situation 2", valeur = PoleEmploiSituationValeurEnum.NonAbordee }
                                                    ]
                                              }
                                            ]
                                        }
                                    }
                            }
                    }
                    |> Extra.ProgramTest.expectView
                        [ expectNoAlert
                        , expectSeeText "Date de mise à jour : non communiquée"
                        , expectSeeText "situation 1"
                        , expectSeeText "objectif 1"
                        , expectSeeText "situation 1"
                        , expectSeeText "Se former"
                        , expectNotSeeText "situation 2"
                        ]
        ]


expectNoAlert : Query.Single msg -> Expect.Expectation
expectNoAlert =
    Query.hasNot [ Selector.attribute <| Attr.attribute "role" "alert" ]


expectSeeText : String -> Query.Single msg -> Expect.Expectation
expectSeeText text =
    Query.has
        [ Selector.containing
            [ Selector.text text
            ]
        ]


expectNotSeeText : String -> Query.Single msg -> Expect.Expectation
expectNotSeeText text =
    Query.hasNot
        [ Selector.containing
            [ Selector.text text
            ]
        ]


type alias PageTest =
    ProgramTest.ProgramTest PoleEmploiPage.Model PoleEmploiPage.Msg (Effect PoleEmploiPage.Msg)


type alias Params =
    { dossierIndividu : Result Http.Error GetDiagnosticPEQuery_root }


startPage : Params -> PageTest
startPage params =
    ProgramTest.createElement
        { init = PoleEmploiPage.init
        , update = PoleEmploiPage.update
        , view = PoleEmploiPage.view
        }
        |> ProgramTest.withSimulatedEffects (simulateEffects params)
        |> ProgramTest.start
            { notebookId = "aNotebookId"
            }


simulateEffects : Params -> Effect PoleEmploiPage.Msg -> ProgramTest.SimulatedEffect PoleEmploiPage.Msg
simulateEffects params effect =
    case effect of
        Effect.Atomic atomic ->
            simulateAtomic params atomic

        Effect.Batch batch ->
            batch |> List.map (simulateAtomic params) |> SimulatedEffect.Cmd.batch


simulateAtomic : Params -> Effect.Atomic PoleEmploiPage.Msg -> ProgramTest.SimulatedEffect PoleEmploiPage.Msg
simulateAtomic params atomic =
    case atomic of
        Effect.GetDossierIndividu _ ->
            params.dossierIndividu
                |> SimulatedEffect.Task.succeed
                |> SimulatedEffect.Task.perform PoleEmploiPage.GotDossierIndividu

        _ ->
            SimulatedEffect.Cmd.none
