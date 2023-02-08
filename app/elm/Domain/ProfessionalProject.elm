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
    { wantedJob : String
    , minimumHourlyWage : Float
    , geopgraphicalArea : Int
    , workingTime : Maybe WorkingTime
    , createdAt : Date
    , updatedAt : Date
    , createdBy : String
    , updatedBy : String
    , themes : List Theme
    }
