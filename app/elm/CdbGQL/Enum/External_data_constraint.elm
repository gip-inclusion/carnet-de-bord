-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Enum.External_data_constraint exposing (..)

import Json.Decode as Decode exposing (Decoder)


{-| unique or primary key constraints on table "external\_data"

  - External\_data\_pkey - unique or primary key constraint on columns "id"

-}
type External_data_constraint
    = External_data_pkey


list : List External_data_constraint
list =
    [ External_data_pkey ]


decoder : Decoder External_data_constraint
decoder =
    Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "external_data_pkey" ->
                        Decode.succeed External_data_pkey

                    _ ->
                        Decode.fail ("Invalid External_data_constraint type, " ++ string ++ " try re-running the @dillonkearns/elm-graphql CLI ")
            )


{-| Convert from the union type representing the Enum to a string that the GraphQL server will recognize.
-}
toString : External_data_constraint -> String
toString enum____ =
    case enum____ of
        External_data_pkey ->
            "external_data_pkey"


{-| Convert from a String representation to an elm representation enum.
This is the inverse of the Enum `toString` function. So you can call `toString` and then convert back `fromString` safely.

    Swapi.Enum.Episode.NewHope
        |> Swapi.Enum.Episode.toString
        |> Swapi.Enum.Episode.fromString
        == Just NewHope

This can be useful for generating Strings to use for <select> menus to check which item was selected.

-}
fromString : String -> Maybe External_data_constraint
fromString enumString____ =
    case enumString____ of
        "external_data_pkey" ->
            Just External_data_pkey

        _ ->
            Nothing