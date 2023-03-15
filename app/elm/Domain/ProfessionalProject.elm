module Domain.ProfessionalProject exposing (..)

import Date exposing (Date)
import Decimal exposing (Decimal)


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
    , hourlyRate : Maybe Decimal
    , contractType : Maybe ContractType
    , workingTimeType : Maybe WorkingTime
    }


type alias Rome =
    { id : String
    , label : String
    }


contractTypeToLabel : ContractType -> String
contractTypeToLabel contractType =
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


contractTypeToKey : ContractType -> String
contractTypeToKey contractType =
    case contractType of
        CDI ->
            "cdi"

        CDD ->
            "cdd"

        Interim ->
            "interim"

        Seasonal ->
            "saisonnier"

        Liberal ->
            "liberale"

        Professionalization ->
            "contrat_professionnalisation"

        Apprenticeship ->
            "apprentissage"

        Portage ->
            "portage_salarial"


contractTypeStringToType : String -> Maybe ContractType
contractTypeStringToType contractType =
    case contractType of
        "CDI" ->
            Just CDI

        "cdi" ->
            Just CDI

        "CDD" ->
            Just CDD

        "cdd" ->
            Just CDD

        "Intérim" ->
            Just Interim

        "interim" ->
            Just Interim

        "Saisonier" ->
            Just Seasonal

        "saisonnier" ->
            Just Seasonal

        "Libéral" ->
            Just Liberal

        "liberale" ->
            Just Liberal

        "Contrat de professionnalisation" ->
            Just Professionalization

        "contrat_professionnalisation" ->
            Just Professionalization

        "Apprentissage" ->
            Just Apprenticeship

        "apprentissage" ->
            Just Apprenticeship

        "Portage salarial" ->
            Just Portage

        "portage_salarial" ->
            Just Portage

        _ ->
            Nothing


workingTimeStringToType : String -> Maybe WorkingTime
workingTimeStringToType key =
    case key of
        "full_time" ->
            Just FullTime

        "part_time" ->
            Just PartTime

        "Temps plein" ->
            Just FullTime

        "Temps partiel" ->
            Just PartTime

        _ ->
            Nothing


workingTimeToLabel : WorkingTime -> String
workingTimeToLabel workingTime =
    case workingTime of
        FullTime ->
            "Temps plein"

        PartTime ->
            "Temps partiel"


workingTimeToKey : WorkingTime -> String
workingTimeToKey workingTime =
    case workingTime of
        FullTime ->
            "full_time"

        PartTime ->
            "part_time"
