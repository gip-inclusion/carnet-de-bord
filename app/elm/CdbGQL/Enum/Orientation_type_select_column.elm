-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Enum.Orientation_type_select_column exposing (..)

import Json.Decode as Decode exposing (Decoder)


{-| select columns of table "orientation\_type"

  - Id - column name
  - Label - column name

-}
type Orientation_type_select_column
    = Id
    | Label


list : List Orientation_type_select_column
list =
    [ Id, Label ]


decoder : Decoder Orientation_type_select_column
decoder =
    Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "id" ->
                        Decode.succeed Id

                    "label" ->
                        Decode.succeed Label

                    _ ->
                        Decode.fail ("Invalid Orientation_type_select_column type, " ++ string ++ " try re-running the @dillonkearns/elm-graphql CLI ")
            )


{-| Convert from the union type representing the Enum to a string that the GraphQL server will recognize.
-}
toString : Orientation_type_select_column -> String
toString enum____ =
    case enum____ of
        Id ->
            "id"

        Label ->
            "label"


{-| Convert from a String representation to an elm representation enum.
This is the inverse of the Enum `toString` function. So you can call `toString` and then convert back `fromString` safely.

    Swapi.Enum.Episode.NewHope
        |> Swapi.Enum.Episode.toString
        |> Swapi.Enum.Episode.fromString
        == Just NewHope

This can be useful for generating Strings to use for <select> menus to check which item was selected.

-}
fromString : String -> Maybe Orientation_type_select_column
fromString enumString____ =
    case enumString____ of
        "id" ->
            Just Id

        "label" ->
            Just Label

        _ ->
            Nothing
