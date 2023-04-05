module Diagnostic.Main exposing
    ( ContractTypeFlags
    , Flags
    , GenderType(..)
    , Model
    , PeFlags
    , PersonalSituation
    , PersonalSituationFlags
    , PersonalSituationsByTheme
    , ProfessionalProjectFlags
    , ProfessionalSituationFlags
    , WorkingTimeFlags
    , addMoneyUnit
    , extractProfessionalProjectFromFlags
    , main
    , workSituationDateFormat
    )

import Browser
import Date exposing (Date, fromIsoString)
import DateFormat
import Decimal
import Domain.Account exposing (Account)
import Domain.PoleEmploi.GeneralData exposing (GeneralData)
import Domain.ProfessionalProject exposing (ContractType, ProfessionalProject, Rome, WorkingTime, contractTypeStringToType, contractTypeToLabel, workingTimeStringToType, workingTimeToLabel)
import Domain.ProfessionalSituation exposing (ProfessionalSituation, educationLevelKeyToString, workSituationKeyToString)
import Domain.Theme exposing (themeKeyStringToString)
import Html
import Html.Attributes exposing (class, rowspan)
import Iso8601
import List.Extra
import Time
import TimeZone


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
    , contractType : Maybe ContractTypeFlags
    , employmentType : Maybe WorkingTimeFlags
    , hourlyRate : Maybe Int
    , createdAt : String
    , updatedAt : String
    , updater : Maybe Account
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


type alias ContractTypeFlags =
    { id : String }


type alias WorkingTimeFlags =
    { id : String }


type alias PersonalSituation =
    { theme : String
    , description : String
    , createdAt : String
    , creator : Maybe Account
    }


type alias PersonalSituationsByTheme =
    { theme : String
    , situations : List PersonalSituation
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
    , creator = flags.creator
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
    , hourlyRate =
        flags.hourlyRate
            |> Maybe.map Decimal.fromInt
            |> Maybe.map (Decimal.mul (Decimal.fromIntWithExponent 1 -2))
    , contractType = extractContractType flags.contractType
    , workingTimeType = extractWorkingTimeType flags.employmentType
    , updatedAt = Iso8601.toTime flags.updatedAt |> Result.toMaybe
    , createdAt = Iso8601.toTime flags.createdAt |> Result.toMaybe
    , updater = flags.updater
    }


extractContractType : Maybe ContractTypeFlags -> Maybe ContractType
extractContractType contractTypeFlag =
    Maybe.andThen (.id >> contractTypeStringToType) contractTypeFlag


extractWorkingTimeType : Maybe WorkingTimeFlags -> Maybe WorkingTime
extractWorkingTimeType workingTimeFlag =
    Maybe.andThen (.id >> workingTimeStringToType) workingTimeFlag



-- VIEW


formatAccount : Maybe Account -> String
formatAccount account =
    account
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


dateFormat : String
dateFormat =
    "dd/MM/yyyy"


parisZone : Time.Zone
parisZone =
    TimeZone.europe__paris ()


unfilled : GenderType -> String
unfilled genderType =
    "Non renseigné"
        ++ (case genderType of
                Feminine ->
                    "e"

                Masculine ->
                    ""
           )


view : Model -> Html.Html msg
view model =
    Html.div [ class "mb-10" ] (socioProDiagFirstRowView model ++ [ professionalProjectView model, personalSituationView model ])


workSituationDateFormat : Maybe Date -> Maybe Date -> Maybe (Html.Html msg)
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
            Just (Html.span [ class "text-sm" ] [ Html.text (prettyDate start "Depuis le ") ])

        ( Nothing, Just end ) ->
            Just (Html.span [ class "text-sm" ] [ Html.text (prettyDate end "Jusqu'au ") ])

        ( Just start, Just end ) ->
            Just
                (Html.span [ class "text-sm" ]
                    [ Html.text (prettyDate start "Du " ++ prettyDate end " au ")
                    , Html.span [ class "italic font-bold" ] [ Html.text (" (" ++ (Date.diff Date.Months start end |> String.fromInt) ++ " mois)") ]
                    ]
                )

        _ ->
            Nothing


socioProDiagFirstRowView : Model -> List (Html.Html msg)
socioProDiagFirstRowView { professionalSituation, peGeneralData } =
    [ Html.div [ class "fr-container--fluid" ]
        [ Html.div [ class "fr-grid-row fr-grid-row--gutters flex" ]
            [ socioProView professionalSituation
            , peInformationsView peGeneralData
            ]
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
                    [ situationElement "Situation actuelle"
                        (Maybe.map (workSituationKeyToString >> Html.text) professionalSituation.workSituation)
                        (unfilled Feminine)
                        (workSituationDateFormat professionalSituation.workSituationDate professionalSituation.workSituationEndDate)
                    ]
                , Html.div [ class "fr-col-6" ]
                    [ situationElement "Date du dernier emploi"
                        (Maybe.map (Date.format "dd/MM/yyyy" >> Html.text) professionalSituation.lastJobEndedAt)
                        "Non renseigné"
                        Nothing
                    ]
                , Html.div [ class "fr-col-6" ]
                    [ situationElement "Dispose d'un RQTH"
                        (Just
                            (if professionalSituation.rightRqth then
                                Html.text "Oui"

                             else
                                Html.text "Non"
                            )
                        )
                        (unfilled Masculine)
                        Nothing
                    ]
                , Html.div [ class "fr-col-6" ]
                    [ situationElement "Diplôme"
                        (Maybe.map (educationLevelKeyToString >> Html.text) professionalSituation.educationLevel)
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


peInformationsView : GeneralData -> Html.Html msg
peInformationsView peGeneralData =
    Html.div [ class "fr-col-6 flex flex-col" ]
        [ Html.h3 [ class "text-xl" ]
            [ Html.text "Informations Pôle emploi" ]
        , Html.div [ class "fr-container shadow-dsfr rounded-lg flex-1 pt-4" ]
            [ Html.div [ class "fr-grid-row fr-grid-row--gutters" ]
                [ Html.div [ class "fr-col-6" ]
                    [ situationElement "Date d'inscription à Pôle emploi"
                        (Maybe.map (Date.format dateFormat >> Html.text) peGeneralData.dateInscription)
                        (unfilled Feminine)
                        Nothing
                    ]
                , Html.div [ class "fr-col-6" ]
                    [ situationElement "Motif d'inscription"
                        (Maybe.map Html.text peGeneralData.motifInscription)
                        (unfilled Masculine)
                        Nothing
                    ]
                , Html.div [ class "fr-col-6" ]
                    [ situationElement "Dernière mise à jour du PPAE"
                        (Maybe.map (Date.format dateFormat >> Html.text) peGeneralData.dateDerEntretienPpae)
                        (unfilled Feminine)
                        Nothing
                    ]
                , Html.div [ class "fr-col-6" ]
                    [ situationElement "Axe de travail"
                        (Maybe.map Html.text (peWorkstream peGeneralData.mrechAxetravailprincipal peGeneralData.mrechAxetravailsecondaire))
                        (unfilled Masculine)
                        Nothing
                    ]
                ]
            ]
        ]


formatLastUpdateInformation : ProfessionalProject -> String
formatLastUpdateInformation professionalProject =
    let
        formattedUpdater =
            formatAccount professionalProject.updater

        updater =
            if formattedUpdater == "" then
                ""

            else
                " par " ++ formattedUpdater

        updatedAt =
            case professionalProject.updatedAt |> Maybe.map (DateFormat.format "dd/MM/yyyy" parisZone) of
                Nothing ->
                    ""

                Just date ->
                    " le " ++ date
    in
    "Mis à jour" ++ updater ++ updatedAt


professionalProjectView : Model -> Html.Html msg
professionalProjectView { professionalProjects } =
    Html.div [ class "pt-10 flex flex-col" ]
        [ Html.h3
            [ class "text-xl" ]
            [ Html.text "Projets professionnels" ]
        , if List.isEmpty professionalProjects then
            Html.span [ class "fr-container shadow-dsfr rounded-lg py-8" ] [ Html.text "Aucun projet professionel défini" ]

          else
            Html.div [ class "space-y-8" ]
                (professionalProjects
                    |> List.map
                        (\professionalProject ->
                            Html.div [ class "fr-container shadow-dsfr rounded-lg" ]
                                [ Html.div [ class "pt-8 mb-8" ]
                                    [ Html.h4 [ class "text-france-bleu mb-0" ]
                                        [ Html.text (Maybe.withDefault "Projet en construction" (Maybe.map .label professionalProject.rome)) ]
                                    , Html.div [ class "text-sm" ] [ professionalProject |> formatLastUpdateInformation |> Html.text ]
                                    ]
                                , Html.div
                                    [ class "fr-grid-row fr-grid-row--gutters" ]
                                    [ Html.div [ class "fr-col-4" ]
                                        [ situationElement "Type de contrat"
                                            (professionalProject.contractType
                                                |> Maybe.map contractTypeToLabel
                                                |> Maybe.map Html.text
                                            )
                                            (unfilled Masculine)
                                            Nothing
                                        , situationElement "Durée de temps de travail"
                                            (professionalProject.workingTimeType
                                                |> Maybe.map workingTimeToLabel
                                                |> Maybe.map Html.text
                                            )
                                            (unfilled Feminine)
                                            Nothing
                                        ]
                                    , Html.div
                                        [ class "fr-col-4" ]
                                        [ situationElement "Salaire minimum brut horaire"
                                            (professionalProject.hourlyRate
                                                |> Maybe.map Decimal.toString
                                                |> Maybe.map addMoneyUnit
                                                |> Maybe.map Html.text
                                            )
                                            (unfilled Masculine)
                                            Nothing
                                        ]
                                    , Html.div [ class "fr-col-4" ]
                                        [ situationElement "Zone de mobilité"
                                            (professionalProject.mobilityRadius
                                                |> Maybe.map String.fromInt
                                                |> Maybe.map addDistanceUnit
                                                |> Maybe.map Html.text
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
    distance ++ String.fromChar nonbreakableSpaceChar ++ "km"


addMoneyUnit : String -> String
addMoneyUnit distance =
    distance ++ String.fromChar nonbreakableSpaceChar ++ "€"


nonbreakableSpaceChar : Char
nonbreakableSpaceChar =
    '\u{00A0}'


personalSituationView : Model -> Html.Html msg
personalSituationView { personalSituations } =
    Html.div [ class "pt-10 flex flex-col" ]
        [ Html.h3 [ class "text-xl" ] [ Html.text "Situation personnelle" ]
        , Html.div [ class "fr-container shadow-dsfr rounded-lg py-8" ]
            [ if List.isEmpty personalSituations then
                Html.span [] [ Html.text "Aucune situation renseignée" ]

              else
                Html.table [ class "w-full" ]
                    [ Html.thead [ class "text-left pb-4" ]
                        [ Html.th [ class "font-normal text-sm leading-10 pl-2" ] [ Html.text "Thématique" ]
                        , Html.th [ class "font-normal text-sm" ] [ Html.text "Situation" ]
                        , Html.th [ class "font-normal text-sm" ] [ Html.text "Ajouté le" ]
                        , Html.th [ class "font-normal text-sm" ] [ Html.text "Ajouté par" ]
                        ]
                    , Html.tbody []
                        (personalSituations
                            |> List.indexedMap
                                (\personalIndex personalSituation ->
                                    personalSituation.situations
                                        |> List.indexedMap
                                            (\index situation ->
                                                Html.tr
                                                    [ if modBy 2 personalIndex == 0 then
                                                        class "bg-gray-100 align-text-top text-left"

                                                      else
                                                        class "align-text-top text-left"
                                                    ]
                                                    [ if index == 0 then
                                                        Html.th [ class "font-bold pr-8 pl-2 py-3", rowspan (List.length personalSituation.situations) ]
                                                            [ personalSituation.theme |> themeKeyStringToString |> Html.text ]

                                                      else
                                                        Html.text ""
                                                    , Html.td [ class "font-bold pr-8 py-3" ]
                                                        [ Html.text situation.description ]
                                                    , Html.td [ class "pr-8 py-3" ]
                                                        [ Html.text situation.createdAt ]
                                                    , Html.td [ class "py-3" ]
                                                        [ situation.creator |> formatAccount |> Html.text ]
                                                    ]
                                            )
                                )
                            |> List.concat
                        )
                    ]
            ]
        ]


situationElement : String -> Maybe (Html.Html msg) -> String -> Maybe (Html.Html msg) -> Html.Html msg
situationElement label someValue defaultText someHint =
    Html.p [ class "text-sm" ]
        [ Html.span [ class "block" ] [ Html.text label ]
        , Html.span [ class "block font-bold" ]
            [ Maybe.withDefault (Html.text defaultText) someValue ]
        , Maybe.withDefault (Html.text "") someHint
        ]
