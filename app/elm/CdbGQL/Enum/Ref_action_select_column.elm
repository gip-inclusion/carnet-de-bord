-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Enum.Ref_action_select_column exposing (..)

import Json.Decode as Decode exposing (Decoder)


{-| select columns of table "ref\_action"

  - Description - column name
  - Id - column name
  - Theme - column name

-}
type Ref_action_select_column
    = Description
    | Id
    | Theme


list : List Ref_action_select_column
list =
    [ Description, Id, Theme ]


decoder : Decoder Ref_action_select_column
decoder =
    Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "description" ->
                        Decode.succeed Description

                    "id" ->
                        Decode.succeed Id

                    "theme" ->
                        Decode.succeed Theme

                    _ ->
                        Decode.fail ("Invalid Ref_action_select_column type, " ++ string ++ " try re-running the @dillonkearns/elm-graphql CLI ")
            )


{-| Convert from the union type representing the Enum to a string that the GraphQL server will recognize.
-}
toString : Ref_action_select_column -> String
toString enum____ =
    case enum____ of
        Description ->
            "description"

        Id ->
            "id"

        Theme ->
            "theme"


{-| Convert from a String representation to an elm representation enum.
This is the inverse of the Enum `toString` function. So you can call `toString` and then convert back `fromString` safely.

    Swapi.Enum.Episode.NewHope
        |> Swapi.Enum.Episode.toString
        |> Swapi.Enum.Episode.fromString
        == Just NewHope

This can be useful for generating Strings to use for <select> menus to check which item was selected.

-}
fromString : String -> Maybe Ref_action_select_column
fromString enumString____ =
    case enumString____ of
        "description" ->
            Just Description

        "id" ->
            Just Id

        "theme" ->
            Just Theme

        _ ->
            Nothing