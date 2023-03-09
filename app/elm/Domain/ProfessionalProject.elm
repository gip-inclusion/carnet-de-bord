module Domain.ProfessionalProject exposing (..)

import Date exposing (Date)


type WorkingTime
    = FullTime
    | PartTime


type ContractType
    = CDI
    | CDD
    | Interim
    | Seasonal
    | Liberal
    | Professionalization
    | Apprenticeship
    | Portage


type ThemeValue
    = ChoosingAJob
    | Training
    | PreparingApplication
    | FindingAJob
    | CreatingACompany
    | International


type ThemeType
    = PointOfSupport
    | Need
    | Unexplored


type alias Theme =
    { themeValue : ThemeValue
    , themeType : ThemeType
    }


type alias ProfessionalProject =
    { id : String
    , rome : Maybe Rome
    , mobilityRadius : Maybe Int
    , createdAt : Maybe Date
    , updatedAt : Maybe Date
    , hourlyRate : Maybe Float
    , contractType : Maybe ContractType
    , workingTimeType : Maybe WorkingTime
    }


type alias Rome =
    { id : String
    , label : String
    }


contractTypeKeyToType : String -> Maybe ContractType
contractTypeKeyToType key =
    case key of
        "cdi" ->
            Just CDI

        "cdd" ->
            Just CDD

        "interim" ->
            Just Interim

        "saisonnier" ->
            Just Seasonal

        "liberale" ->
            Just Liberal

        "contrat_professionnalisation" ->
            Just Professionalization

        "apprentissage" ->
            Just Apprenticeship

        "portage_salarial" ->
            Just Portage

        _ ->
            Nothing


contractTypeToString : ContractType -> String
contractTypeToString contractType =
    case contractType of
        CDI ->
            "CDI"

        CDD ->
            "CDD"

        Interim ->
            "Intérim"

        Seasonal ->
            "Saisonier"

        Liberal ->
            "Libéral"

        Professionalization ->
            "Contrat de professionnalisation"

        Apprenticeship ->
            "Apprentissage"

        Portage ->
            "Portage salarial"


workingTimeKeyToType : String -> Maybe WorkingTime
workingTimeKeyToType key =
    case key of
        "full_time" ->
            Just FullTime

        "part_time" ->
            Just PartTime

        _ ->
            Nothing


workingTimeToString : WorkingTime -> String
workingTimeToString workingTime =
    case workingTime of
        FullTime ->
            "Temps plein"

        PartTime ->
            "Temps partiel"
