-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Enum.Admin_cdb_select_column exposing (..)

import Json.Decode as Decode exposing (Decoder)


{-| select columns of table "admin\_cdb"

  - CreatedAt - column name
  - Email - column name
  - Firstname - column name
  - Id - column name
  - Lastname - column name
  - UpdatedAt - column name

-}
type Admin_cdb_select_column
    = CreatedAt
    | Email
    | Firstname
    | Id
    | Lastname
    | UpdatedAt


list : List Admin_cdb_select_column
list =
    [ CreatedAt, Email, Firstname, Id, Lastname, UpdatedAt ]


decoder : Decoder Admin_cdb_select_column
decoder =
    Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "createdAt" ->
                        Decode.succeed CreatedAt

                    "email" ->
                        Decode.succeed Email

                    "firstname" ->
                        Decode.succeed Firstname

                    "id" ->
                        Decode.succeed Id

                    "lastname" ->
                        Decode.succeed Lastname

                    "updatedAt" ->
                        Decode.succeed UpdatedAt

                    _ ->
                        Decode.fail ("Invalid Admin_cdb_select_column type, " ++ string ++ " try re-running the @dillonkearns/elm-graphql CLI ")
            )


{-| Convert from the union type representing the Enum to a string that the GraphQL server will recognize.
-}
toString : Admin_cdb_select_column -> String
toString enum____ =
    case enum____ of
        CreatedAt ->
            "createdAt"

        Email ->
            "email"

        Firstname ->
            "firstname"

        Id ->
            "id"

        Lastname ->
            "lastname"

        UpdatedAt ->
            "updatedAt"


{-| Convert from a String representation to an elm representation enum.
This is the inverse of the Enum `toString` function. So you can call `toString` and then convert back `fromString` safely.

    Swapi.Enum.Episode.NewHope
        |> Swapi.Enum.Episode.toString
        |> Swapi.Enum.Episode.fromString
        == Just NewHope

This can be useful for generating Strings to use for <select> menus to check which item was selected.

-}
fromString : String -> Maybe Admin_cdb_select_column
fromString enumString____ =
    case enumString____ of
        "createdAt" ->
            Just CreatedAt

        "email" ->
            Just Email

        "firstname" ->
            Just Firstname

        "id" ->
            Just Id

        "lastname" ->
            Just Lastname

        "updatedAt" ->
            Just UpdatedAt

        _ ->
            Nothing
