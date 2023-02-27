module Domain.ProfessionalProject exposing (..)

import Date exposing (Date)


type WorkingTime
    = FullTime
    | PartTime


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

    -- , minimumHourlyWage : Float
    -- , workingTime : Maybe WorkingTime
    -- , createdBy : String
    -- , updatedBy : String
    -- , themes : List Theme
    }


type alias Rome =
    { id : String
    , label : String
    }
