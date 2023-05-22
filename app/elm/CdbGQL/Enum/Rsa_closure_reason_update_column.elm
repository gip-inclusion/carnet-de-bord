-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Enum.Rsa_closure_reason_update_column exposing (..)

import Json.Decode as Decode exposing (Decoder)


{-| update columns of table "rsa\_closure\_reason"

  - Code - column name
  - Label - column name

-}
type Rsa_closure_reason_update_column
    = Code
    | Label


list : List Rsa_closure_reason_update_column
list =
    [ Code, Label ]


decoder : Decoder Rsa_closure_reason_update_column
decoder =
    Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "code" ->
                        Decode.succeed Code

                    "label" ->
                        Decode.succeed Label

                    _ ->
                        Decode.fail ("Invalid Rsa_closure_reason_update_column type, " ++ string ++ " try re-running the @dillonkearns/elm-graphql CLI ")
            )


{-| Convert from the union type representing the Enum to a string that the GraphQL server will recognize.
-}
toString : Rsa_closure_reason_update_column -> String
toString enum____ =
    case enum____ of
        Code ->
            "code"

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
fromString : String -> Maybe Rsa_closure_reason_update_column
fromString enumString____ =
    case enumString____ of
        "code" ->
            Just Code

        "label" ->
            Just Label

        _ ->
            Nothing
