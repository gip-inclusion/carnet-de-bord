-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Enum.Structure_orientation_system_constraint exposing (..)

import Json.Decode as Decode exposing (Decoder)


{-| unique or primary key constraints on table "structure\_orientation\_system"

  - Structure\_orientation\_system\_pkey - unique or primary key constraint on columns "id"
  - Structure\_orientation\_system\_structure\_id\_orientation\_system\_id - unique or primary key constraint on columns "structure\_id", "orientation\_system\_id"

-}
type Structure_orientation_system_constraint
    = Structure_orientation_system_pkey
    | Structure_orientation_system_structure_id_orientation_system_id


list : List Structure_orientation_system_constraint
list =
    [ Structure_orientation_system_pkey, Structure_orientation_system_structure_id_orientation_system_id ]


decoder : Decoder Structure_orientation_system_constraint
decoder =
    Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "structure_orientation_system_pkey" ->
                        Decode.succeed Structure_orientation_system_pkey

                    "structure_orientation_system_structure_id_orientation_system_id" ->
                        Decode.succeed Structure_orientation_system_structure_id_orientation_system_id

                    _ ->
                        Decode.fail ("Invalid Structure_orientation_system_constraint type, " ++ string ++ " try re-running the @dillonkearns/elm-graphql CLI ")
            )


{-| Convert from the union type representing the Enum to a string that the GraphQL server will recognize.
-}
toString : Structure_orientation_system_constraint -> String
toString enum____ =
    case enum____ of
        Structure_orientation_system_pkey ->
            "structure_orientation_system_pkey"

        Structure_orientation_system_structure_id_orientation_system_id ->
            "structure_orientation_system_structure_id_orientation_system_id"


{-| Convert from a String representation to an elm representation enum.
This is the inverse of the Enum `toString` function. So you can call `toString` and then convert back `fromString` safely.

    Swapi.Enum.Episode.NewHope
        |> Swapi.Enum.Episode.toString
        |> Swapi.Enum.Episode.fromString
        == Just NewHope

This can be useful for generating Strings to use for <select> menus to check which item was selected.

-}
fromString : String -> Maybe Structure_orientation_system_constraint
fromString enumString____ =
    case enumString____ of
        "structure_orientation_system_pkey" ->
            Just Structure_orientation_system_pkey

        "structure_orientation_system_structure_id_orientation_system_id" ->
            Just Structure_orientation_system_structure_id_orientation_system_id

        _ ->
            Nothing