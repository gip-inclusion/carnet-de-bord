-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Enum.Notebook_member_constraint exposing (..)

import Json.Decode as Decode exposing (Decoder)


{-| unique or primary key constraints on table "notebook\_member"

  - Notebook\_member\_notebook\_id\_account\_id\_if\_active - unique or primary key constraint on columns "account\_id", "notebook\_id"
  - Notebook\_member\_pkey - unique or primary key constraint on columns "id"
  - Notebook\_member\_unique\_referent - unique or primary key constraint on columns "notebook\_id"

-}
type Notebook_member_constraint
    = Notebook_member_notebook_id_account_id_if_active
    | Notebook_member_pkey
    | Notebook_member_unique_referent


list : List Notebook_member_constraint
list =
    [ Notebook_member_notebook_id_account_id_if_active, Notebook_member_pkey, Notebook_member_unique_referent ]


decoder : Decoder Notebook_member_constraint
decoder =
    Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "notebook_member_notebook_id_account_id_if_active" ->
                        Decode.succeed Notebook_member_notebook_id_account_id_if_active

                    "notebook_member_pkey" ->
                        Decode.succeed Notebook_member_pkey

                    "notebook_member_unique_referent" ->
                        Decode.succeed Notebook_member_unique_referent

                    _ ->
                        Decode.fail ("Invalid Notebook_member_constraint type, " ++ string ++ " try re-running the @dillonkearns/elm-graphql CLI ")
            )


{-| Convert from the union type representing the Enum to a string that the GraphQL server will recognize.
-}
toString : Notebook_member_constraint -> String
toString enum____ =
    case enum____ of
        Notebook_member_notebook_id_account_id_if_active ->
            "notebook_member_notebook_id_account_id_if_active"

        Notebook_member_pkey ->
            "notebook_member_pkey"

        Notebook_member_unique_referent ->
            "notebook_member_unique_referent"


{-| Convert from a String representation to an elm representation enum.
This is the inverse of the Enum `toString` function. So you can call `toString` and then convert back `fromString` safely.

    Swapi.Enum.Episode.NewHope
        |> Swapi.Enum.Episode.toString
        |> Swapi.Enum.Episode.fromString
        == Just NewHope

This can be useful for generating Strings to use for <select> menus to check which item was selected.

-}
fromString : String -> Maybe Notebook_member_constraint
fromString enumString____ =
    case enumString____ of
        "notebook_member_notebook_id_account_id_if_active" ->
            Just Notebook_member_notebook_id_account_id_if_active

        "notebook_member_pkey" ->
            Just Notebook_member_pkey

        "notebook_member_unique_referent" ->
            Just Notebook_member_unique_referent

        _ ->
            Nothing
