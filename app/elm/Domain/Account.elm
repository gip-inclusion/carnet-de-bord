module Domain.Account exposing (Account, OrientationManager, Professional, print)

import Domain.Name
import Domain.Structure exposing (Structure)
import Extra.String


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
            Extra.String.capitalize o.firstname ++ " " ++ String.toUpper o.lastname

        _ ->
            ""


printPro : Professional -> String
printPro pro =
    "$name($structureName)"
        |> String.replace "$name" (Domain.Name.printFullName pro)
        |> String.replace "$structureName"
            (pro.structure
                |> Maybe.map .name
                |> Maybe.withDefault ""
            )
