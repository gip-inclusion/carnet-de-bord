module Diagnostic.Main exposing (..)

import Browser
import Date exposing (Date, fromIsoString)
import Domain.PoleEmploi.GeneralData exposing (GeneralData)
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


type alias ProfessionalSituationFlags =
    { workSituation : Maybe String
    , workSituationDate : Maybe String
    , workSituationEndDate : Maybe String
    , rightRqth : Bool
    , geographicalArea : Maybe String
    , educationLevel : Maybe String
    , wantedJobs : List String
    , lastJobEndedAt : Maybe String
    }


type alias Flags =
    { professionalSituation : ProfessionalSituationFlags
    , peGeneralData : Maybe PeFlags
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
    { professionalSituation : SituationPro
    , professionalProjects : List ProfessionalProject
    , peGeneralData : GeneralData
    }


init : Flags -> ( Model, Cmd msg )
init flags =
    ( { professionalSituation = extractSituationFromFlags flags
      , professionalProjects = []
      , peGeneralData = extractPeGeneralDataFromFlags flags
      }
    , Cmd.none
    )


extractSituationFromFlags : Flags -> SituationPro
extractSituationFromFlags { professionalSituation } =
    { workSituation = professionalSituation.workSituation
    , workSituationDate =
        professionalSituation.workSituationDate
            |> Maybe.andThen (fromIsoString >> Result.toMaybe)
    , workSituationEndDate =
        professionalSituation.workSituationEndDate
            |> Maybe.andThen (fromIsoString >> Result.toMaybe)
    , rightRqth = professionalSituation.rightRqth
    , geographicalArea = professionalSituation.geographicalArea
    , educationLevel = professionalSituation.educationLevel
    , wantedJobs = professionalSituation.wantedJobs
    , lastJobEndedAt = professionalSituation.lastJobEndedAt |> Maybe.andThen (fromIsoString >> Result.toMaybe)
    }


extractPeGeneralDataFromFlags : Flags -> GeneralData
extractPeGeneralDataFromFlags { peGeneralData } =
    case peGeneralData of
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
    div [ class "mb-10" ] (professionalSituationView model ++ [ professionalProjectView model ])


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


professionalSituationView : Model -> List (Html msg)
professionalSituationView { professionalSituation, peGeneralData } =
    [ div [ class "fr-container--fluid" ]
        [ div [ class "fr-grid-row fr-grid-row--gutters" ]
            [ div [ class "fr-col-6" ]
                [ h3 [ class "text-xl" ]
                    [ text "Situation professionnelle" ]
                , div [ class "fr-container shadow-dsfr rounded-lg" ]
                    [ div [ class "fr-grid-row fr-grid-row--gutters" ]
                        [ div [ class "fr-col-6" ]
                            [ situationElement "Situation actuelle"
                                (Maybe.map (workSituationKeyToString >> text) professionalSituation.workSituation)
                                (unfilled True False)
                                (workSituationDateFormat professionalSituation.workSituationDate professionalSituation.workSituationEndDate)
                            ]
                        , div [ class "fr-col-6" ]
                            [ situationElement "Date du dernier emploi"
                                (Maybe.map (Date.format "dd/MM/yyyy" >> text) professionalSituation.lastJobEndedAt)
                                "Non renseigné"
                                Nothing
                            ]
                        , div [ class "fr-col-6" ]
                            [ situationElement "Dispose d'un RQTH"
                                (Just
                                    (if professionalSituation.rightRqth then
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
                                (Maybe.map (educationLevelKeyToString >> text) professionalSituation.educationLevel)
                                (unfilled False False)
                                Nothing
                            ]
                        ]
                    ]
                ]
            , peInformations peGeneralData
            ]
        ]
    ]


peInformations : GeneralData -> Html msg
peInformations peGeneralData =
    div [ class "fr-col-6" ]
        [ h3 [ class "text-xl" ]
            [ text "Informations Pôle emploi" ]
        , div [ class "fr-container shadow-dsfr rounded-lg" ]
            [ div [ class "fr-grid-row fr-grid-row--gutters" ]
                [ div [ class "fr-col-6" ]
                    [ situationElement "Date d'inscription à Pôle emploi"
                        (Maybe.map (Date.format dateFormat >> text) peGeneralData.dateInscription)
                        (unfilled True False)
                        Nothing
                    ]
                , div [ class "fr-col-6" ]
                    [ situationElement "Axe de travail principal"
                        (Maybe.map text peGeneralData.mrechAxetravailprincipal)
                        (unfilled False False)
                        Nothing
                    ]
                , div [ class "fr-col-6" ]
                    [ situationElement "Motif d'inscription"
                        (Maybe.map text peGeneralData.motifInscription)
                        (unfilled False False)
                        Nothing
                    ]
                , div [ class "fr-col-6" ]
                    [ situationElement "Axe de travail secondaire"
                        (Maybe.map text peGeneralData.mrechAxetravailsecondaire)
                        (unfilled False False)
                        Nothing
                    ]
                , div [ class "fr-col-6" ]
                    [ situationElement "Dernière mise à jour du PPAE"
                        (Maybe.map (Date.format dateFormat >> text) peGeneralData.dateDerEntretienPpae)
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


professionalProjectView : Model -> Html msg
professionalProjectView model =
    div [ class "pt-10" ]
        [ h3 [ class "text-xl" ] [ text "Projet professionnel" ]
        , div [ class "fr-container shadow-dsfr rounded-lg" ]
            [ div [ class "fr-grid-row fr-grid-row--gutters" ]
                [ div [ class "fr-col-8" ]
                    [ situationElement "Emplois recherchés"
                        (wantedJobsToHtml model.professionalSituation.wantedJobs)
                        (unfilled False True)
                        Nothing
                    ]
                , div [ class "fr-col-4" ]
                    [ situationElement "Zone de mobilité"
                        (Maybe.map (geographicalAreaKeyToString >> text) model.professionalSituation.geographicalArea)
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
