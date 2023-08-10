module Domain.Situation exposing (Situation)

import Domain.RefTheme exposing (RefTheme)


type alias Situation =
    { id : String
    , description : String
    , theme : RefTheme
    }
