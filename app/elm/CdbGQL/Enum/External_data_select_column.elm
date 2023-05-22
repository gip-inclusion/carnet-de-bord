-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Enum.External_data_select_column exposing (..)

import Json.Decode as Decode exposing (Decoder)


{-| select columns of table "external\_data"

  - Created\_at - column name
  - Data - column name
  - Hash - column name
  - Id - column name
  - Source - column name
  - Updated\_at - column name

-}
type External_data_select_column
    = Created_at
    | Data
    | Hash
    | Id
    | Source
    | Updated_at


list : List External_data_select_column
list =
    [ Created_at, Data, Hash, Id, Source, Updated_at ]


decoder : Decoder External_data_select_column
decoder =
    Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "created_at" ->
                        Decode.succeed Created_at

                    "data" ->
                        Decode.succeed Data

                    "hash" ->
                        Decode.succeed Hash

                    "id" ->
                        Decode.succeed Id

                    "source" ->
                        Decode.succeed Source

                    "updated_at" ->
                        Decode.succeed Updated_at

                    _ ->
                        Decode.fail ("Invalid External_data_select_column type, " ++ string ++ " try re-running the @dillonkearns/elm-graphql CLI ")
            )


{-| Convert from the union type representing the Enum to a string that the GraphQL server will recognize.
-}
toString : External_data_select_column -> String
toString enum____ =
    case enum____ of
        Created_at ->
            "created_at"

        Data ->
            "data"

        Hash ->
            "hash"

        Id ->
            "id"

        Source ->
            "source"

        Updated_at ->
            "updated_at"


{-| Convert from a String representation to an elm representation enum.
This is the inverse of the Enum `toString` function. So you can call `toString` and then convert back `fromString` safely.

    Swapi.Enum.Episode.NewHope
        |> Swapi.Enum.Episode.toString
        |> Swapi.Enum.Episode.fromString
        == Just NewHope

This can be useful for generating Strings to use for <select> menus to check which item was selected.

-}
fromString : String -> Maybe External_data_select_column
fromString enumString____ =
    case enumString____ of
        "created_at" ->
            Just Created_at

        "data" ->
            Just Data

        "hash" ->
            Just Hash

        "id" ->
            Just Id

        "source" ->
            Just Source

        "updated_at" ->
            Just Updated_at

        _ ->
            Nothing
