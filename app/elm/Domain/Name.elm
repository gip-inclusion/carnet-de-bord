module Domain.Name exposing (printFullName)

import Extra.String exposing (capitalize)


printFullName : { a | firstname : String, lastname : String } -> String
printFullName { firstname, lastname } =
    [ capitalize firstname, String.toUpper lastname ]
        |> String.join " "
