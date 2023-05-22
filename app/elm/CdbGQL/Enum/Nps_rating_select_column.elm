-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Enum.Nps_rating_select_column exposing (..)

import Json.Decode as Decode exposing (Decoder)


{-| select columns of table "nps\_rating"

  - AccountId - column name
  - CreatedAt - column name
  - Id - column name
  - Score - column name

-}
type Nps_rating_select_column
    = AccountId
    | CreatedAt
    | Id
    | Score


list : List Nps_rating_select_column
list =
    [ AccountId, CreatedAt, Id, Score ]


decoder : Decoder Nps_rating_select_column
decoder =
    Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "accountId" ->
                        Decode.succeed AccountId

                    "createdAt" ->
                        Decode.succeed CreatedAt

                    "id" ->
                        Decode.succeed Id

                    "score" ->
                        Decode.succeed Score

                    _ ->
                        Decode.fail ("Invalid Nps_rating_select_column type, " ++ string ++ " try re-running the @dillonkearns/elm-graphql CLI ")
            )


{-| Convert from the union type representing the Enum to a string that the GraphQL server will recognize.
-}
toString : Nps_rating_select_column -> String
toString enum____ =
    case enum____ of
        AccountId ->
            "accountId"

        CreatedAt ->
            "createdAt"

        Id ->
            "id"

        Score ->
            "score"


{-| Convert from a String representation to an elm representation enum.
This is the inverse of the Enum `toString` function. So you can call `toString` and then convert back `fromString` safely.

    Swapi.Enum.Episode.NewHope
        |> Swapi.Enum.Episode.toString
        |> Swapi.Enum.Episode.fromString
        == Just NewHope

This can be useful for generating Strings to use for <select> menus to check which item was selected.

-}
fromString : String -> Maybe Nps_rating_select_column
fromString enumString____ =
    case enumString____ of
        "accountId" ->
            Just AccountId

        "createdAt" ->
            Just CreatedAt

        "id" ->
            Just Id

        "score" ->
            Just Score

        _ ->
            Nothing
