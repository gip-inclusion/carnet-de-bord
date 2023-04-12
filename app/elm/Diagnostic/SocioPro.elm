module Diagnostic.SocioPro exposing (Flags, Model, PeFlags, ProfessionalSituationFlags, init, view, workSituationDateFormat)

import Date exposing (Date, fromIsoString)
import Diagnostic.SituationElement exposing (Gender(..))
import Domain.PoleEmploi.GeneralData exposing (GeneralData)
import Domain.ProfessionalSituation exposing (ProfessionalSituation, educationLevelKeyToString, workSituationKeyToString)
import Extra.Date
import Html
import Html.Attributes exposing (class)



-- Flags


type alias Flags =
    { professionalSituation : ProfessionalSituationFlags
    , peGeneralData : Maybe PeFlags
    }


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
    , educationLevel : Maybe String
    , lastJobEndedAt : Maybe String
    }



-- MODEL


type alias Model =
    { professionalSituation : ProfessionalSituation
    , peGeneralData : GeneralData
    }


init : Flags -> Model
init flags =
    { professionalSituation = extractSituationFromFlags flags
    , peGeneralData = extractPeGeneralDataFromFlags flags
    }


extractSituationFromFlags : Flags -> ProfessionalSituation
extractSituationFromFlags { professionalSituation } =
    { workSituation = professionalSituation.workSituation
    , workSituationDate =
        professionalSituation.workSituationDate
            |> Maybe.andThen (fromIsoString >> Result.toMaybe)
    , workSituationEndDate =
        professionalSituation.workSituationEndDate
            |> Maybe.andThen (fromIsoString >> Result.toMaybe)
    , rightRqth = professionalSituation.rightRqth
    , educationLevel = professionalSituation.educationLevel
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



-- View


view : Model -> Html.Html msg
view { professionalSituation, peGeneralData } =
    Html.div [ class "fr-container--fluid overflow-visible" ]
        [ Html.div [ class "fr-grid-row fr-grid-row--gutters flex" ]
            [ socioProView professionalSituation
            , peInformationsView peGeneralData
            ]
        ]


socioProView : ProfessionalSituation -> Html.Html msg
socioProView professionalSituation =
    Html.div [ class "fr-col-6 flex flex-col" ]
        [ Html.h3 [ class "text-xl" ]
            [ Html.text "Situation professionnelle" ]
        , Html.div [ class "fr-container shadow-dsfr rounded-lg flex-1 pt-4" ]
            [ Html.div [ class "fr-grid-row fr-grid-row--gutters" ]
                [ Html.div [ class "fr-col-6" ]
                    [ Diagnostic.SituationElement.view
                        { label = { value = "Situation actuelle", gender = Feminine }
                        , value =
                            professionalSituation.workSituation
                                |> Maybe.map workSituationKeyToString
                        , hint =
                            workSituationDateFormat
                                professionalSituation.workSituationDate
                                professionalSituation.workSituationEndDate
                        }
                    ]
                , Html.div [ class "fr-col-6" ]
                    [ Diagnostic.SituationElement.view
                        { label = { value = "Date du dernier emploi", gender = Masculine }
                        , value =
                            professionalSituation.lastJobEndedAt
                                |> Maybe.map (Date.format "dd/MM/yyyy")
                        , hint = Nothing
                        }
                    ]
                , Html.div [ class "fr-col-6" ]
                    [ Diagnostic.SituationElement.view
                        { label = { value = "Dispose d'une RQTH", gender = Masculine }
                        , value =
                            Just <|
                                if professionalSituation.rightRqth then
                                    "Oui"

                                else
                                    "Non"
                        , hint = Nothing
                        }
                    ]
                , Html.div [ class "fr-col-6" ]
                    [ Diagnostic.SituationElement.view
                        { label = { value = "Diplôme", gender = Masculine }
                        , value =
                            professionalSituation.educationLevel
                                |> Maybe.map educationLevelKeyToString
                        , hint = Nothing
                        }
                    ]
                ]
            ]
        ]


workSituationDateFormat : Maybe Date -> Maybe Date -> Maybe (Html.Html msg)
workSituationDateFormat startDate endDate =
    let
        prettyDate : Date -> String -> String
        prettyDate date label =
            date
                |> Extra.Date.print
                |> String.append label
    in
    case ( startDate, endDate ) of
        ( Just start, Nothing ) ->
            Just (Html.span [ class "text-sm" ] [ Html.text (prettyDate start "Depuis le ") ])

        ( Nothing, Just end ) ->
            Just (Html.span [ class "text-sm" ] [ Html.text (prettyDate end "Jusqu'au ") ])

        ( Just start, Just end ) ->
            Just
                (Html.span [ class "text-sm" ]
                    [ Html.text (prettyDate start "Du " ++ prettyDate end " au ")
                    , Html.span
                        [ class "italic font-bold" ]
                        [ Html.text (" (" ++ (Date.diff Date.Months start end |> String.fromInt) ++ " mois)") ]
                    ]
                )

        _ ->
            Nothing


peInformationsView : GeneralData -> Html.Html msg
peInformationsView peGeneralData =
    Html.div [ class "fr-col-6 flex flex-col" ]
        [ Html.h3 [ class "text-xl" ]
            [ Html.text "Informations Pôle emploi" ]
        , Html.div [ class "fr-container shadow-dsfr rounded-lg flex-1 pt-4" ]
            [ Html.div [ class "fr-grid-row fr-grid-row--gutters" ]
                [ Html.div [ class "fr-col-6" ]
                    [ Diagnostic.SituationElement.view
                        { label = { value = "Date d'inscription à Pôle emploi", gender = Feminine }
                        , value =
                            peGeneralData.dateInscription
                                |> Maybe.map Extra.Date.print
                        , hint = Nothing
                        }
                    ]
                , Html.div [ class "fr-col-6" ]
                    [ Diagnostic.SituationElement.view
                        { label = { value = "Motif d'inscription", gender = Masculine }
                        , value = peGeneralData.motifInscription
                        , hint = Nothing
                        }
                    ]
                , Html.div [ class "fr-col-6" ]
                    [ Diagnostic.SituationElement.view
                        { label = { value = "Dernière mise à jour du PPAE", gender = Feminine }
                        , value =
                            peGeneralData.dateDerEntretienPpae
                                |> Maybe.map Extra.Date.print
                        , hint = Nothing
                        }
                    ]
                , Html.div [ class "fr-col-6" ]
                    [ Diagnostic.SituationElement.view
                        { label = { value = "Axe de travail", gender = Masculine }
                        , value =
                            case
                                joinWithSlash
                                    peGeneralData.mrechAxetravailprincipal
                                    peGeneralData.mrechAxetravailsecondaire
                            of
                                "" ->
                                    Nothing

                                other ->
                                    Just other
                        , hint = Nothing
                        }
                    ]
                ]
            ]
        ]


joinWithSlash : Maybe String -> Maybe String -> String
joinWithSlash principal secondary =
    [ principal, secondary ]
        |> List.filterMap identity
        |> String.join " / "
