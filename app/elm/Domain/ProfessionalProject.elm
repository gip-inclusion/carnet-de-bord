module Domain.ProfessionalProject exposing
    ( ContractType(..)
    , ProfessionalProject
    , WorkingTime(..)
    , contractTypeStringToType
    , contractTypeToKey
    , contractTypeToLabel
    , workingTimeStringToType
    , workingTimeToKey
    , workingTimeToLabel
    )

import Decimal exposing (Decimal)
import Domain.Account exposing (Account)
import Time
import Domain.Rome.Select exposing (Rome)


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


type alias ProfessionalProject =
    { id : String
    , rome : Maybe Rome
    , mobilityRadius : Maybe Int
    , createdAt : Maybe Time.Posix
    , updatedAt : Maybe Time.Posix
    , updater : Maybe Account
    , hourlyRate : Maybe Decimal
    , contractType : Maybe ContractType
    , workingTimeType : Maybe WorkingTime
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
            "Saisonnier"

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
            "liberal"

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

        "Saisonnier" ->
            Just Seasonal

        "saisonnier" ->
            Just Seasonal

        "Libéral" ->
            Just Liberal

        "liberal" ->
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
