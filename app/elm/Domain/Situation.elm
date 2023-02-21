module Domain.Situation exposing (Situation)

import Domain.Theme exposing (Theme)


type alias Situation =
    { id : String
    , description : String
    , theme : Theme
    }
