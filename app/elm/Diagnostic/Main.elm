module Diagnostic.Main exposing (..)

import Browser
import Date exposing (Date, fromIsoString)
import Domain.PoleEmploi.PrincipalData exposing (PrincipalData)
import Domain.ProfessionalProject exposing (ProfessionalProject)
import Domain.SituationPro exposing (SituationPro, educationLevelKeyToString, geographicalAreaKeyToString, workSituationKeyToString)
import Html exposing (..)
import Html.Attributes exposing (class)


type alias PeFlags =
    { mrech_axetravailprincipal : Maybe String
    , mrech_axetravailsecondaire : Maybe String
    , inscription : Maybe String
    , motif_inscription : Maybe String
    , der_entretien_ppae : Maybe String
    }


type alias Flags =
    { workSituation : Maybe String
    , workSituationDate : Maybe String
    , workSituationEndDate : Maybe String
    , rightRqth : Bool
    , geographicalArea : Maybe String
    , educationLevel : Maybe String
    , wantedJobs : List String
    , lastJobEndedAt : Maybe String
    , pePrincipalData : Maybe PeFlags
    }


main : Program Flags Model msg
main =
    Browser.element
        { init = init
        , view = view
        , update = \_ model -> ( model, Cmd.none )
        , subscriptions = \_ -> Sub.none
        }



-- MODEL


type alias Model =
    { situationPro : SituationPro
    , professionalProjects : List ProfessionalProject
    , pePrincipalData : PrincipalData
    }


init : Flags -> ( Model, Cmd msg )
init flags =
    ( { situationPro = extractSituationFromFlags flags
      , professionalProjects = []
      , pePrincipalData = extractPePrincipalDataFromFlags flags
      }
    , Cmd.none
    )


extractSituationFromFlags : Flags -> SituationPro
extractSituationFromFlags flags =
    { workSituation = flags.workSituation
    , workSituationDate =
        flags.workSituationDate
            |> Maybe.andThen (fromIsoString >> Result.toMaybe)
    , workSituationEndDate =
        flags.workSituationEndDate
            |> Maybe.andThen (fromIsoString >> Result.toMaybe)
    , rightRqth = flags.rightRqth
    , geographicalArea = flags.geographicalArea
    , educationLevel = flags.educationLevel
    , wantedJobs = flags.wantedJobs
    , lastJobEndedAt = flags.lastJobEndedAt |> Maybe.andThen (fromIsoString >> Result.toMaybe)
    }


extractPePrincipalDataFromFlags : Flags -> PrincipalData
extractPePrincipalDataFromFlags { pePrincipalData } =
    case pePrincipalData of
        Just data ->
            { mrechAxetravailprincipal = data.mrech_axetravailprincipal
            , mrechAxetravailsecondaire = data.mrech_axetravailsecondaire
            , dateInscription = data.inscription |> Maybe.andThen (fromIsoString >> Result.toMaybe)
            , motifInscription = data.motif_inscription
            , dateDerEntretienPpae = data.der_entretien_ppae |> Maybe.andThen (fromIsoString >> Result.toMaybe)
            }

        Nothing ->
            { mrechAxetravailprincipal = Nothing
            , mrechAxetravailsecondaire = Nothing
            , dateInscription = Nothing
            , motifInscription = Nothing
            , dateDerEntretienPpae = Nothing
            }



-- VIEW


dateFormat : String
dateFormat =
    "dd/MM/yyyy"


unfilled : Bool -> Bool -> String
unfilled feminine plural =
    "Non renseigné"
        ++ (if feminine then
                "e"

            else
                ""
           )
        ++ (if plural then
                "s"

            else
                ""
           )


view : Model -> Html msg
view model =
    div [ class "mb-10" ] (professionalSituation model ++ [ professionalProject model ])


workSituationDateFormat : Maybe Date -> Maybe Date -> Maybe (Html msg)
workSituationDateFormat startDate endDate =
    let
        prettyDate : Date -> String -> String
        prettyDate date label =
            date
                |> Date.format dateFormat
                |> String.append label
    in
    case ( startDate, endDate ) of
        ( Just start, Nothing ) ->
            Just (span [ class "text-sm" ] [ text (prettyDate start "Depuis le ") ])

        ( Nothing, Just end ) ->
            Just (span [ class "text-sm" ] [ text (prettyDate end "Jusqu'au ") ])

        ( Just start, Just end ) ->
            Just
                (span [ class "text-sm" ]
                    [ text (prettyDate start "Du " ++ prettyDate end " au ")
                    , span [ class "italic font-bold" ] [ text (" (" ++ (Date.diff Date.Months start end |> String.fromInt) ++ " mois)") ]
                    ]
                )

        _ ->
            Nothing


professionalSituation : Model -> List (Html msg)
professionalSituation { situationPro, pePrincipalData } =
    [ div [ class "fr-container--fluid" ]
        [ div [ class "fr-grid-row fr-grid-row--gutters" ]
            [ div [ class "fr-col-6" ]
                [ h3 [ class "text-xl" ]
                    [ text "Situation professionnelle" ]
                , div [ class "fr-container shadow-dsfr rounded-lg" ]
                    [ div [ class "fr-grid-row fr-grid-row--gutters" ]
                        [ div [ class "fr-col-6" ]
                            [ situationElement "Situation actuelle"
                                (Maybe.map (workSituationKeyToString >> text) situationPro.workSituation)
                                (unfilled True False)
                                (workSituationDateFormat situationPro.workSituationDate situationPro.workSituationEndDate)
                            ]
                        , div [ class "fr-col-6" ]
                            [ situationElement "Date du dernier emploi"
                                (Maybe.map (Date.format "dd/MM/yyyy" >> text) situationPro.lastJobEndedAt)
                                "Non renseigné"
                                Nothing
                            ]
                        , div [ class "fr-col-6" ]
                            [ situationElement "Dispose d'un RQTH"
                                (Just
                                    (if situationPro.rightRqth then
                                        text "Oui"

                                     else
                                        text "Non"
                                    )
                                )
                                (unfilled False False)
                                Nothing
                            ]
                        , div [ class "fr-col-6" ]
                            [ situationElement "Diplôme"
                                (Maybe.map (educationLevelKeyToString >> text) situationPro.educationLevel)
                                (unfilled False False)
                                Nothing
                            ]
                        ]
                    ]
                ]
            , peInformations pePrincipalData
            ]
        ]
    ]


peInformations : PrincipalData -> Html msg
peInformations pePrincipalData =
    div [ class "fr-col-6" ]
        [ h3 [ class "text-xl" ]
            [ text "Informations Pôle emploi" ]
        , div [ class "fr-container shadow-dsfr rounded-lg" ]
            [ div [ class "fr-grid-row fr-grid-row--gutters" ]
                [ div [ class "fr-col-6" ]
                    [ situationElement "Date d'inscription à Pôle emploi"
                        (Maybe.map (Date.format dateFormat >> text) pePrincipalData.dateInscription)
                        (unfilled True False)
                        Nothing
                    ]
                , div [ class "fr-col-6" ]
                    [ situationElement "Axe de travail principal"
                        (Maybe.map text pePrincipalData.mrechAxetravailprincipal)
                        (unfilled False False)
                        Nothing
                    ]
                , div [ class "fr-col-6" ]
                    [ situationElement "Motif d'inscription"
                        (Maybe.map text pePrincipalData.motifInscription)
                        (unfilled False False)
                        Nothing
                    ]
                , div [ class "fr-col-6" ]
                    [ situationElement "Axe de travail secondaire"
                        (Maybe.map text pePrincipalData.mrechAxetravailsecondaire)
                        (unfilled False False)
                        Nothing
                    ]
                , div [ class "fr-col-6" ]
                    [ situationElement "Dernière mise à jour du PPAE"
                        (Maybe.map (Date.format dateFormat >> text) pePrincipalData.dateDerEntretienPpae)
                        (unfilled True False)
                        Nothing
                    ]
                ]
            ]
        ]


wantedJobsToHtml : List String -> Maybe (Html msg)
wantedJobsToHtml wantedJobs =
    case wantedJobs of
        [] ->
            Nothing

        jobs ->
            Just
                (ul []
                    (jobs
                        |> List.map (\job -> li [] [ text job ])
                    )
                )


professionalProject : Model -> Html msg
professionalProject model =
    div [ class "pt-10" ]
        [ h3 [ class "text-xl" ] [ text "Projet professionnel" ]
        , div [ class "fr-container shadow-dsfr rounded-lg" ]
            [ div [ class "fr-grid-row fr-grid-row--gutters" ]
                [ div [ class "fr-col-8" ]
                    [ situationElement "Emplois recherchés"
                        (wantedJobsToHtml model.situationPro.wantedJobs)
                        (unfilled False True)
                        Nothing
                    ]
                , div [ class "fr-col-4" ]
                    [ situationElement "Zone de mobilité"
                        (Maybe.map (geographicalAreaKeyToString >> text) model.situationPro.geographicalArea)
                        (unfilled True False)
                        Nothing
                    ]
                ]
            ]
        ]


situationElement : String -> Maybe (Html msg) -> String -> Maybe (Html msg) -> Html msg
situationElement label someValue defaultText someHint =
    p []
        [ span [ class "block" ] [ text label ]
        , span [ class "block font-bold" ]
            [ Maybe.withDefault (text defaultText) someValue ]
        , Maybe.withDefault (text "") someHint
        ]
