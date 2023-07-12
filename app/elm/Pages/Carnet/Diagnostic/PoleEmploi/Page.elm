module Pages.Carnet.Diagnostic.PoleEmploi.Page exposing (Besoin, Contrainte, Diagnostic, Flags, Model(..), Msg(..), ProjetProfessionel, init, update, view)

import BetaGouv.DSFR.Accordion
import BetaGouv.DSFR.Alert
import Domain.PoleEmploi.ContraintePersonnelle as ContraintePersonnelle
import Effect exposing (Effect)
import Extra.Date
import Extra.Http
import GraphQL.Enum.PoleEmploiBesoinValeurEnum as PoleEmploiBesoinValeurEnum exposing (PoleEmploiBesoinValeurEnum)
import GraphQL.Enum.PoleEmploiContrainteValeurEnum as PoleEmploiContrainteValeurEnum
import GraphQL.Enum.PoleEmploiObjectifValeurEnum as PoleEmploiObjectifValeurEnum
import GraphQL.Enum.PoleEmploiSituationValeurEnum as PoleEmploiSituationValeurEnum
import Html exposing (Html)
import Html.Attributes as Attr
import Http
import Iso8601
import Pages.Carnet.Diagnostic.PoleEmploi.GetDiagnosticPE as PEDiagnostic
import Sentry
import Time



-- Model


type alias Contrainte =
    { situations : List String
    , theme : ContraintePersonnelle.ContraintePersonnelle
    , objectifs : List String
    }


type alias ProjetProfessionel =
    { nom : Maybe String
    , idMetierChiffre : String
    , besoins : List Besoin
    , dateDeMiseAJour : Maybe Time.Posix
    }


type alias Besoin =
    { libelle : String
    , valeur : PoleEmploiBesoinValeurEnum
    }


type Model
    = Loading
    | Success Diagnostic
    | NotFound
    | Error String


type alias Diagnostic =
    { contraintes : List Contrainte
    , dateDeModification : Maybe Time.Posix
    , projetProfessionels : List ProjetProfessionel
    }


type alias Flags =
    { notebookId : String }


init : Flags -> ( Model, Effect Msg )
init flags =
    ( Loading
    , Effect.getDossierIndividu
        { notebookId = flags.notebookId
        , callbackMsg = GotDossierIndividu
        }
    )



-- Update


type Msg
    = Noop
    | GotDossierIndividu (Result Http.Error PEDiagnostic.GetDiagnosticPEQuery_root)


update : Msg -> Model -> ( Model, Effect Msg )
update msg model =
    case msg of
        Noop ->
            ( model, Effect.none )

        GotDossierIndividu result ->
            case
                result
            of
                Err error ->
                    ( Error "Erreur lors de la récupération du diagnostic France Travail."
                    , Effect.fromCmd <| Sentry.sendError (Extra.Http.toString error)
                    )

                Ok response ->
                    case response.diagnostic_pole_emploi of
                        Just data ->
                            ( Success (data |> fromDossierIndividu), Effect.none )

                        Nothing ->
                            ( NotFound, Effect.none )


fromDossierIndividu : PEDiagnostic.PoleEmploiDossierIndividu -> Diagnostic
fromDossierIndividu dossier =
    { contraintes = dossier.contraintesIndividusDto.contraintes |> List.concatMap toContraintes
    , dateDeModification = dossier.contraintesIndividusDto.dateDeModification |> Maybe.andThen (Iso8601.toTime >> Result.toMaybe)
    , projetProfessionels = dossier.besoinsParDiagnosticIndividuDtos |> List.concatMap toProjetProfessionnel
    }


toProjetProfessionnel : PEDiagnostic.PoleEmploiDossierIndividuBesoinsParDiagnosticIndividu -> List ProjetProfessionel
toProjetProfessionnel projet =
    if projet.statut == "EN_COURS" then
        [ { nom = projet.nomMetier
          , idMetierChiffre = projet.idMetierChiffre
          , besoins = projet.besoins |> List.map toBesoins
          , dateDeMiseAJour = projet.dateMiseAJour |> Maybe.andThen (Iso8601.toTime >> Result.toMaybe)
          }
        ]

    else
        []


toBesoins : PEDiagnostic.PoleEmploiDossierIndividuBesoins -> Besoin
toBesoins peBesoin =
    { libelle = peBesoin.libelle, valeur = peBesoin.valeur }


toContraintes : PEDiagnostic.PoleEmploiDossierIndividuContraintes -> List Contrainte
toContraintes peContrainte =
    if peContrainte.valeur == PoleEmploiContrainteValeurEnum.Oui then
        [ { situations = peContrainte.situations |> List.filterMap toSituation
          , objectifs = peContrainte.objectifs |> List.filterMap toObjectif
          , theme =
                ContraintePersonnelle.parse peContrainte.libelle
                    -- TODO: Handle unknow ContraintePersonnelle value
                    |> Maybe.withDefault ContraintePersonnelle.ContraintesFamiliales
          }
        ]

    else
        []


toSituation : PEDiagnostic.PoleEmploiDossierIndividuSituations -> Maybe String
toSituation situation =
    if situation.valeur == PoleEmploiSituationValeurEnum.Oui then
        Just situation.libelle

    else
        Nothing


toObjectif : PEDiagnostic.PoleEmploiDossierIndividuObjectifs -> Maybe String
toObjectif objectif =
    if objectif.valeur == PoleEmploiObjectifValeurEnum.EnCours then
        Just objectif.libelle

    else
        Nothing



-- View


view : Model -> Html Msg
view model =
    Html.section [ Attr.class "flex flex-col gap-8" ]
        [ Html.h1 [] [ Html.text "Diagnostic France Travail" ]
        , case
            model
          of
            Loading ->
                Html.text "Chargement..."

            Error error ->
                BetaGouv.DSFR.Alert.small { title = Nothing, description = error }
                    |> BetaGouv.DSFR.Alert.alert Nothing BetaGouv.DSFR.Alert.error

            NotFound ->
                Html.text "Aucun dossier France Travail trouvé"

            Success diagnostic ->
                Html.div []
                    [ Html.div
                        [ Attr.class "flex flex-col gap-8" ]
                        ([ Html.div []
                            [ Html.h2 [ Attr.class "mb-4" ] [ Html.text "Contrainte(s) personnelles(s)" ]
                            , Html.span []
                                [ Html.text
                                    ("Date de mise à jour\u{00A0}: "
                                        ++ (diagnostic.dateDeModification
                                                |> Maybe.map (Extra.Date.fromPosix >> Extra.Date.print)
                                                |> Maybe.withDefault "non communiquée"
                                           )
                                    )
                                ]
                            ]
                         , viewContraintesHighlights diagnostic
                         , viewSituations diagnostic
                         , viewObjectif diagnostic
                         , Html.h2 [] [ Html.text "Projet(s) professionnel(s)" ]
                         ]
                            ++ (diagnostic.projetProfessionels |> List.map viewProjetProfessionnel)
                        )
                    ]
        ]


viewProjetProfessionnel : ProjetProfessionel -> Html Msg
viewProjetProfessionnel projetProfessionnel =
    BetaGouv.DSFR.Accordion.single
        { id = projetProfessionnel.idMetierChiffre
        , open = True
        , onClick = Noop
        , header = Html.span [ Attr.class "text-2xl text-vert-cdb " ] [ Html.text <| Maybe.withDefault "Projet en construction" projetProfessionnel.nom ]
        , content =
            Html.div []
                [ Html.span []
                    [ Html.text
                        ("Date de mise à jour\u{00A0}: "
                            ++ (projetProfessionnel.dateDeMiseAJour
                                    |> Maybe.map (Extra.Date.fromPosix >> Extra.Date.print)
                                    |> Maybe.withDefault "non communiquée"
                               )
                        )
                    ]
                , Html.table [ Attr.class "w-full" ]
                    [ Html.thead [ Attr.class "sticky" ]
                        [ Html.tr []
                            [ Html.th [ Attr.class "p-2" ] []
                            , Html.th [ Attr.class "text-center p-2 text-lg text-vert-cdb font-normal" ] [ Html.text "Statut" ]
                            ]
                        ]
                    , Html.tbody [ Attr.class "divide-y" ]
                        (projetProfessionnel.besoins
                            |> List.map
                                (\p ->
                                    Html.tr []
                                        [ Html.td [ Attr.class "p-2 w-full" ] [ Html.span [] [ Html.text p.libelle ] ]
                                        , Html.td [ Attr.class "p-2 text-left min-w-max whitespace-nowrap" ]
                                            [ viewStatusIcon p.valeur ]
                                        ]
                                )
                        )
                    ]
                ]
        }


viewStatusIcon : PoleEmploiBesoinValeurEnum -> Html Msg
viewStatusIcon valeur =
    let
        displayIcon : { icon : String, label : String, color : String } -> Html Msg
        displayIcon p =
            Html.div []
                [ Html.span
                    [ Attr.class p.icon
                    , Attr.class p.color
                    , Attr.class "pr-3"
                    , Attr.attribute "aria-label" p.label
                    ]
                    []
                , Html.text p.label
                ]
    in
    case valeur of
        PoleEmploiBesoinValeurEnum.PointFort ->
            displayIcon { label = "Point\u{00A0}fort", icon = "fr-icon-success-fill", color = "text-vert-cdb" }

        PoleEmploiBesoinValeurEnum.Besoin ->
            displayIcon { label = "Besoin", icon = "fr-icon-error-warning-fill", color = "text-information" }

        PoleEmploiBesoinValeurEnum.NonExplore ->
            displayIcon { label = "Non\u{00A0}exploré", icon = "fr-icon-question-fill", color = "text-gray-300" }


viewObjectif : Diagnostic -> Html Msg
viewObjectif model =
    Html.div [ Attr.class "flex flex-col gap-4" ]
        [ Html.h3 [ Attr.class "m-0 font-normal text-xl text-vert-cdb" ] [ Html.text "Objectif(s)" ]
        , Html.div
            [ Attr.class "fr-container shadow-dsfr rounded-lg p-6" ]
            [ if List.isEmpty model.contraintes then
                Html.span [] [ Html.text "Aucune objectif renseigné" ]

              else
                Html.table [ Attr.class "w-full striped" ]
                    [ Html.thead [ Attr.class "text-left pb-4" ]
                        [ Html.th [ Attr.class "font-normal text-sm leading-10 p-2" ] [ Html.text "Thématique" ]
                        , Html.th [ Attr.class "font-normal text-sm p-2" ] [ Html.text "Objectif(s) en cours" ]
                        ]
                    , Html.tbody []
                        (model.contraintes |> List.map viewObjectifRow)
                    ]
            ]
        ]


viewObjectifRow : Contrainte -> Html Msg
viewObjectifRow contrainte =
    Html.tr [ Attr.class "odd:bg-gray-100 text-sm font-bold" ]
        [ Html.td [ Attr.class "p-2 align-top" ] [ Html.text <| ContraintePersonnelle.print contrainte.theme ]
        , Html.td [ Attr.class "p-2" ]
            (contrainte.objectifs
                |> withDashOnEmpty
                |> List.map
                    (\objectifs ->
                        Html.p [ Attr.class "m-0" ]
                            [ Html.text objectifs ]
                    )
            )
        ]


withDashOnEmpty : List String -> List String
withDashOnEmpty list =
    case list of
        [] ->
            [ "-" ]

        _ ->
            list


viewContraintesHighlights : Diagnostic -> Html Msg
viewContraintesHighlights model =
    Html.div [ Attr.class "flex flex-wrap gap-4" ]
        (ContraintePersonnelle.all
            |> List.map
                (\contrainte ->
                    viewContrainteHighlight
                        { contrainteDuReferentiel = contrainte
                        , contraintesDuBeneficiaire = model.contraintes
                        }
                )
        )


viewContrainteHighlight :
    { contrainteDuReferentiel : ContraintePersonnelle.ContraintePersonnelle
    , contraintesDuBeneficiaire : List Contrainte
    }
    -> Html Msg
viewContrainteHighlight { contrainteDuReferentiel, contraintesDuBeneficiaire } =
    Html.div
        [ Attr.class "flex-1 shrink-0 border rounded-lg p-4"
        , Attr.style "min-width" "9.4rem"
        , Attr.classList
            [ ( "bg-vert-cdb text-white"
              , contraintesDuBeneficiaire
                    |> List.map .theme
                    |> List.member contrainteDuReferentiel
              )
            ]
        ]
        [ Html.div [ Attr.class "flex flex-col items-center gap-4 overflow-hidden" ]
            [ ContraintePersonnelle.icon contrainteDuReferentiel
            , Html.p
                [ Attr.class "text-center break-words font-bold m-0" ]
                [ Html.text <| ContraintePersonnelle.print contrainteDuReferentiel ]
            ]
        ]


viewSituations : Diagnostic -> Html Msg
viewSituations model =
    Html.div [ Attr.class "flex flex-col gap-4" ]
        [ Html.h3 [ Attr.class "m-0 font-normal text-xl text-vert-cdb" ] [ Html.text "Situation(s)" ]
        , Html.div
            [ Attr.class "fr-container shadow-dsfr rounded-lg p-6" ]
            [ if List.isEmpty model.contraintes then
                Html.span [] [ Html.text "Aucune situation renseignée" ]

              else
                Html.table [ Attr.class "w-full striped" ]
                    [ Html.thead [ Attr.class "text-left pb-4" ]
                        [ Html.th [ Attr.class "font-normal text-sm leading-10 p-2" ] [ Html.text "Thématique" ]
                        , Html.th [ Attr.class "font-normal text-sm p-2" ] [ Html.text "Situation(s)" ]
                        ]
                    , Html.tbody []
                        (model.contraintes |> List.map viewContrainteRow)
                    ]
            ]
        ]


viewContrainteRow : Contrainte -> Html Msg
viewContrainteRow contrainte =
    Html.tr [ Attr.class "odd:bg-gray-100 text-sm font-bold" ]
        [ Html.td [ Attr.class "p-2 align-top" ] [ Html.text <| ContraintePersonnelle.print contrainte.theme ]
        , Html.td [ Attr.class "p-2" ] (contrainte.situations |> List.map (\situation -> Html.p [ Attr.class "m-0" ] [ Html.text situation ]))
        ]
