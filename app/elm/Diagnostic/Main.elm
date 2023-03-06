module Diagnostic.Main exposing (..)

import Browser
import Date exposing (Date, fromIsoString)
import Domain.Account exposing (Account)
import Domain.PoleEmploi.GeneralData exposing (GeneralData)
import Domain.ProfessionalProject exposing (ProfessionalProject, Rome)
import Domain.ProfessionalSituation exposing (ProfessionalSituation, educationLevelKeyToString, workSituationKeyToString)
import Domain.Theme exposing (themeKeyStringToString)
import Html exposing (..)
import Html.Attributes exposing (class, rowspan)
import List.Extra


type alias Flags =
    { professionalSituation : ProfessionalSituationFlags
    , peGeneralData : Maybe PeFlags
    , personalSituations : Maybe (List PersonalSituationFlags)
    , professionalProjects : List ProfessionalProjectFlags
    }


type alias ProfessionalProjectFlags =
    { id : String
    , rome : Maybe Rome
    , mobilityRadius : Maybe Int
    , createdAt : String
    , updatedAt : String
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


type alias PersonalSituation =
    { theme : String
    , description : String
    , createdAt : String
    , creator : String
    }


type alias PersonalSituationsByTheme =
    { theme : String
    , situations : List PersonalSituation
    }


type alias Creator =
    { firstname : String
    , lastname : String
    , structure : Maybe String
    }


type alias PersonalSituationFlags =
    { refSituation :
        { theme : String
        , description : String
        }
    , createdAt : String
    , creator : Maybe Account
    }


type GenderType
    = Feminine
    | Plural
    | FemininePlural
    | Masculine


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
    { professionalSituation : ProfessionalSituation
    , professionalProjects : List ProfessionalProject
    , peGeneralData : GeneralData
    , personalSituations : List PersonalSituationsByTheme
    }


init : Flags -> ( Model, Cmd msg )
init flags =
    ( { professionalSituation = extractSituationFromFlags flags
      , professionalProjects = extractProfessionalProjectsFromFlags flags
      , peGeneralData = extractPeGeneralDataFromFlags flags
      , personalSituations = extractPersonalSituationsFromFlags flags
      }
    , Cmd.none
    )


extractPersonalSituationFromFlags : PersonalSituationFlags -> PersonalSituation
extractPersonalSituationFromFlags flags =
    { theme = flags.refSituation.theme
    , description = flags.refSituation.description
    , createdAt = flags.createdAt
    , creator =
        flags.creator
            |> Maybe.map
                (\creator ->
                    case ( creator.professional, creator.orientation_manager ) of
                        ( Just p, _ ) ->
                            p.firstname ++ " " ++ p.lastname ++ Maybe.withDefault "" (Maybe.map (\s -> " (" ++ s.name ++ ")") p.structure)

                        ( _, Just o ) ->
                            o.firstname ++ " " ++ o.lastname

                        _ ->
                            ""
                )
            |> Maybe.withDefault ""
    }


extractPersonalSituationsToPersonalSituationsByTheme : ( PersonalSituation, List PersonalSituation ) -> PersonalSituationsByTheme
extractPersonalSituationsToPersonalSituationsByTheme ( first, tail ) =
    { theme = first.theme
    , situations = first :: tail
    }


extractPersonalSituationsFromFlags : Flags -> List PersonalSituationsByTheme
extractPersonalSituationsFromFlags { personalSituations } =
    Maybe.withDefault [] personalSituations
        |> List.map extractPersonalSituationFromFlags
        |> List.Extra.gatherEqualsBy .theme
        |> List.map extractPersonalSituationsToPersonalSituationsByTheme


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


extractProfessionalProjectsFromFlags : Flags -> List ProfessionalProject
extractProfessionalProjectsFromFlags { professionalProjects } =
    List.map extractProfessionalProjectFromFlags professionalProjects


extractProfessionalProjectFromFlags : ProfessionalProjectFlags -> ProfessionalProject
extractProfessionalProjectFromFlags flags =
    { rome = flags.rome
    , id = flags.id
    , mobilityRadius = flags.mobilityRadius
    , updatedAt = fromIsoString flags.updatedAt |> Result.toMaybe
    , createdAt = fromIsoString flags.createdAt |> Result.toMaybe
    }



-- VIEW


dateFormat : String
dateFormat =
    "dd/MM/yyyy"


unfilled : GenderType -> String
unfilled genderType =
    "Non renseigné"
        ++ (case genderType of
                Feminine ->
                    "e"

                Plural ->
                    "s"

                FemininePlural ->
                    "es"

                Masculine ->
                    ""
           )


view : Model -> Html msg
view model =
    div [ class "mb-10" ] (socioProDiagFirstRowView model ++ [ professionalProjectView model, personalSituationView model ])


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


socioProDiagFirstRowView : Model -> List (Html msg)
socioProDiagFirstRowView { professionalSituation, peGeneralData } =
    [ div [ class "fr-container--fluid" ]
        [ div [ class "fr-grid-row fr-grid-row--gutters flex" ]
            [ socioProView professionalSituation
            , peInformationsView peGeneralData
            ]
        ]
    ]


socioProView : ProfessionalSituation -> Html msg
socioProView professionalSituation =
    div [ class "fr-col-6 flex flex-col" ]
        [ h3 [ class "text-xl" ]
            [ text "Situation professionnelle" ]
        , div [ class "fr-container shadow-dsfr rounded-lg flex-1 pt-4" ]
            [ div [ class "fr-grid-row fr-grid-row--gutters" ]
                [ div [ class "fr-col-6" ]
                    [ situationElement "Situation actuelle"
                        (Maybe.map (workSituationKeyToString >> text) professionalSituation.workSituation)
                        (unfilled Feminine)
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
                        (unfilled Masculine)
                        Nothing
                    ]
                , div [ class "fr-col-6" ]
                    [ situationElement "Diplôme"
                        (Maybe.map (educationLevelKeyToString >> text) professionalSituation.educationLevel)
                        (unfilled Masculine)
                        Nothing
                    ]
                ]
            ]
        ]


peWorkstream : Maybe String -> Maybe String -> Maybe String
peWorkstream principal secondary =
    case ( principal, secondary ) of
        ( Just p, Nothing ) ->
            Just p

        ( Nothing, Just s ) ->
            Just s

        ( Just p, Just s ) ->
            Just <| p ++ " / " ++ s

        _ ->
            Nothing


peInformationsView : GeneralData -> Html msg
peInformationsView peGeneralData =
    div [ class "fr-col-6 flex flex-col" ]
        [ h3 [ class "text-xl" ]
            [ text "Informations Pôle emploi" ]
        , div [ class "fr-container shadow-dsfr rounded-lg flex-1 pt-4" ]
            [ div [ class "fr-grid-row fr-grid-row--gutters" ]
                [ div [ class "fr-col-6" ]
                    [ situationElement "Date d'inscription à Pôle emploi"
                        (Maybe.map (Date.format dateFormat >> text) peGeneralData.dateInscription)
                        (unfilled Feminine)
                        Nothing
                    ]
                , div [ class "fr-col-6" ]
                    [ situationElement "Motif d'inscription"
                        (Maybe.map text peGeneralData.motifInscription)
                        (unfilled Masculine)
                        Nothing
                    ]
                , div [ class "fr-col-6" ]
                    [ situationElement "Dernière mise à jour du PPAE"
                        (Maybe.map (Date.format dateFormat >> text) peGeneralData.dateDerEntretienPpae)
                        (unfilled Feminine)
                        Nothing
                    ]
                , div [ class "fr-col-6" ]
                    [ situationElement "Axe de travail"
                        (Maybe.map text (peWorkstream peGeneralData.mrechAxetravailprincipal peGeneralData.mrechAxetravailsecondaire))
                        (unfilled Masculine)
                        Nothing
                    ]
                ]
            ]
        ]


professionalProjectView : Model -> Html msg
professionalProjectView { professionalProjects } =
    div [ class "pt-10 flex flex-col" ]
        [ h3
            [ class "text-xl" ]
            [ text "Projets professionnels" ]
        , if List.isEmpty professionalProjects then
            span [ class "fr-container shadow-dsfr rounded-lg py-8" ] [ text "Aucun projet professionel défini" ]

          else
            div [ class "space-y-8" ]
                (professionalProjects
                    |> List.map
                        (\professionalProject ->
                            div [ class "fr-container shadow-dsfr rounded-lg" ]
                                [ div [ class "fr-grid-row fr-grid-row--gutters" ]
                                    [ div [ class "fr-col-6" ]
                                        [ situationElement "Emploi recherché"
                                            (Maybe.map .label professionalProject.rome |> Maybe.map text)
                                            (unfilled Plural)
                                            Nothing
                                        ]
                                    , div [ class "fr-col-6" ]
                                        [ situationElement "Zone de mobilité"
                                            (professionalProject.mobilityRadius
                                                |> Maybe.map String.fromInt
                                                |> Maybe.map addDistanceUnit
                                                |> Maybe.map text
                                            )
                                            (unfilled Feminine)
                                            Nothing
                                        ]
                                    ]
                                ]
                        )
                )
        ]


addDistanceUnit : String -> String
addDistanceUnit distance =
    distance ++ " km"


personalSituationView : Model -> Html msg
personalSituationView { personalSituations } =
    div [ class "pt-10 flex flex-col" ]
        [ h3 [ class "text-xl" ] [ text "Situation personnelle" ]
        , div [ class "fr-container shadow-dsfr rounded-lg py-8" ]
            [ if List.isEmpty personalSituations then
                span [] [ text "Aucune situation renseignée" ]

              else
                table [ class "w-full" ]
                    [ thead [ class "text-left pb-4" ]
                        [ th [ class "font-normal text-sm leading-10 pl-2" ] [ text "Thématique" ]
                        , th [ class "font-normal text-sm" ] [ text "Situation" ]
                        , th [ class "font-normal text-sm" ] [ text "Ajouté le" ]
                        , th [ class "font-normal text-sm" ] [ text "Ajouté par" ]
                        ]
                    , tbody []
                        (personalSituations
                            |> List.indexedMap
                                (\personalIndex personalSituation ->
                                    personalSituation.situations
                                        |> List.indexedMap
                                            (\index situation ->
                                                tr
                                                    [ if modBy 2 personalIndex == 0 then
                                                        class "bg-gray-100 align-text-top text-left"

                                                      else
                                                        class "align-text-top text-left"
                                                    ]
                                                    [ if index == 0 then
                                                        th [ class "font-bold pr-8 pl-2 py-3", rowspan (List.length personalSituation.situations) ]
                                                            [ personalSituation.theme |> themeKeyStringToString |> text ]

                                                      else
                                                        text ""
                                                    , td [ class "font-bold pr-8 py-3" ]
                                                        [ text situation.description ]
                                                    , td [ class "pr-8 py-3" ]
                                                        [ text situation.createdAt ]
                                                    , td [ class "py-3" ]
                                                        [ text situation.creator ]
                                                    ]
                                            )
                                )
                            |> List.concat
                        )
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
