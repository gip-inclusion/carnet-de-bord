module Domain.Account exposing (Account, OrientationManager, Professional, print)

import Domain.Structure exposing (Structure)


type alias Professional =
    { firstname : String
    , lastname : String
    , structure : Maybe Structure
    }


type alias OrientationManager =
    { firstname : String
    , lastname : String
    }


type alias Account =
    { professional : Maybe Professional
    , orientation_manager : Maybe OrientationManager
    }


print : Account -> String
print creator =
    case ( creator.professional, creator.orientation_manager ) of
        ( Just p, _ ) ->
            printPro p

        ( _, Just o ) ->
            o.firstname ++ " " ++ o.lastname

        _ ->
            ""


printPro : Professional -> String
printPro pro =
    "$first $second ($structureName)"
        |> String.replace "$first" pro.firstname
        |> String.replace "$second" pro.lastname
        |> String.replace "$structureName"
            (pro.structure
                |> Maybe.map .name
                |> Maybe.withDefault ""
            )
