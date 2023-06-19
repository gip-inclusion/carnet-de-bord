module Diagnostic.ProfessionalProject exposing (ContractTypeFlags, ProjectFlag, WorkingTimeFlags, extractProfessionalProjectFromFlags, init, printEuros, view)

import Decimal
import Diagnostic.SituationElement exposing (Gender(..))
import Domain.Account exposing (Account)
import Domain.ProfessionalProject exposing (ContractType, ProfessionalProject, Rome, WorkingTime, contractTypeStringToType, contractTypeToLabel, workingTimeStringToType, workingTimeToLabel)
import Extra.Date
import Extra.String
import Html
import Html.Attributes exposing (class)
import Iso8601


type alias ProjectFlag =
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


type alias ContractTypeFlags =
    { id : String }


type alias WorkingTimeFlags =
    { id : String }



-- MODEL


init : List ProjectFlag -> List ProfessionalProject
init flags =
    List.map extractProfessionalProjectFromFlags flags


extractProfessionalProjectFromFlags : ProjectFlag -> ProfessionalProject
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



-- View


view : List ProfessionalProject -> Html.Html msg
view professionalProjects =
    Html.div [ class "pt-10 flex flex-col" ]
        [ Html.h3 [ class "text-xl" ] [ Html.text "Projets professionnels" ]
        , if List.isEmpty professionalProjects then
            Html.span
                [ class "fr-container shadow-dsfr rounded-lg py-8" ]
                [ Html.text "Aucun projet professionel défini" ]

          else
            Html.div
                [ class "space-y-8" ]
                (professionalProjects |> List.map viewSingle)
        ]


viewSingle : ProfessionalProject -> Html.Html msg
viewSingle professionalProject =
    Html.div [ class "fr-container shadow-dsfr rounded-lg" ]
        [ Html.div [ class "pt-8 mb-8" ]
            [ Html.h4
                [ class "text-cdb-vert mb-0" ]
                [ Html.text (Maybe.withDefault "Projet en construction" (Maybe.map .label professionalProject.rome)) ]
            , Html.div
                [ class "text-sm" ]
                [ Html.text <| printLastUpdate professionalProject ]
            ]
        , Html.div
            [ class "fr-grid-row fr-grid-row--gutters" ]
            [ Html.div [ class "fr-col-4" ]
                [ Diagnostic.SituationElement.view
                    { label = { value = "Type de contrat", gender = Masculine }
                    , value =
                        professionalProject.contractType
                            |> Maybe.map contractTypeToLabel
                    , hint = Nothing
                    }
                , Diagnostic.SituationElement.view
                    { label = { value = "Durée de temps de travail", gender = Feminine }
                    , value =
                        professionalProject.workingTimeType
                            |> Maybe.map workingTimeToLabel
                    , hint = Nothing
                    }
                ]
            , Html.div
                [ class "fr-col-4" ]
                [ Diagnostic.SituationElement.view
                    { label = { value = "Salaire minimum brut horaire", gender = Masculine }
                    , value =
                        professionalProject.hourlyRate
                            |> Maybe.map printEuros
                    , hint = Nothing
                    }
                ]
            , Html.div [ class "fr-col-4" ]
                [ Diagnostic.SituationElement.view
                    { label = { value = "Zone de mobilité", gender = Feminine }
                    , value =
                        professionalProject.mobilityRadius
                            |> Maybe.map printInKilometers
                    , hint = Nothing
                    }
                ]
            ]
        ]


printLastUpdate : ProfessionalProject -> String
printLastUpdate professionalProject =
    let
        formattedUpdater =
            professionalProject.updater |> Maybe.map Domain.Account.print |> Maybe.withDefault ""

        updater =
            if formattedUpdater == "" then
                ""

            else
                " par " ++ formattedUpdater

        updatedAt =
            case professionalProject.updatedAt of
                Just posix ->
                    " le " ++ (Extra.Date.print <| Extra.Date.fromPosix posix)

                Nothing ->
                    ""
    in
    "Mis à jour" ++ updater ++ updatedAt


printInKilometers : Int -> String
printInKilometers km =
    String.fromInt km ++ Extra.String.nonBreakableSpace ++ "km"


printEuros : Decimal.Decimal -> String
printEuros euros =
    Decimal.toString euros ++ Extra.String.nonBreakableSpace ++ "€"
