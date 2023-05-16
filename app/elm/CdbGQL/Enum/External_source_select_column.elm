-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Enum.External_source_select_column exposing (..)

import Json.Decode as Decode exposing (Decoder)


{-| select columns of table "external\_source"

  - Comment - column name
  - Value - column name

-}
type External_source_select_column
    = Comment
    | Value


list : List External_source_select_column
list =
    [ Comment, Value ]


decoder : Decoder External_source_select_column
decoder =
    Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "comment" ->
                        Decode.succeed Comment

                    "value" ->
                        Decode.succeed Value

                    _ ->
                        Decode.fail ("Invalid External_source_select_column type, " ++ string ++ " try re-running the @dillonkearns/elm-graphql CLI ")
            )


{-| Convert from the union type representing the Enum to a string that the GraphQL server will recognize.
-}
toString : External_source_select_column -> String
toString enum____ =
    case enum____ of
        Comment ->
            "comment"

        Value ->
            "value"


{-| Convert from a String representation to an elm representation enum.
This is the inverse of the Enum `toString` function. So you can call `toString` and then convert back `fromString` safely.

    Swapi.Enum.Episode.NewHope
        |> Swapi.Enum.Episode.toString
        |> Swapi.Enum.Episode.fromString
        == Just NewHope

This can be useful for generating Strings to use for <select> menus to check which item was selected.

-}
fromString : String -> Maybe External_source_select_column
fromString enumString____ =
    case enumString____ of
        "comment" ->
            Just Comment

        "value" ->
            Just Value

        _ ->
            Nothing