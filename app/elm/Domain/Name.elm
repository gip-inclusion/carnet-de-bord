module Domain.Name exposing (printFullName)

import Extra.String exposing (capitalize)


printFullName : { a | firstName : String, lastName : String } -> String
printFullName { firstName, lastName } =
    [ capitalize firstName, String.toUpper lastName ]
        |> String.join " "
