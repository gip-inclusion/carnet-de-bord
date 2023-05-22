-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Enum.Admin_structure_structure_update_column exposing (..)

import Json.Decode as Decode exposing (Decoder)


{-| update columns of table "admin\_structure\_structure"

  - AdminStructureId - column name
  - CreatedAt - column name
  - DeletedAt - column name
  - Id - column name
  - StructureId - column name

-}
type Admin_structure_structure_update_column
    = AdminStructureId
    | CreatedAt
    | DeletedAt
    | Id
    | StructureId


list : List Admin_structure_structure_update_column
list =
    [ AdminStructureId, CreatedAt, DeletedAt, Id, StructureId ]


decoder : Decoder Admin_structure_structure_update_column
decoder =
    Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "adminStructureId" ->
                        Decode.succeed AdminStructureId

                    "createdAt" ->
                        Decode.succeed CreatedAt

                    "deletedAt" ->
                        Decode.succeed DeletedAt

                    "id" ->
                        Decode.succeed Id

                    "structureId" ->
                        Decode.succeed StructureId

                    _ ->
                        Decode.fail ("Invalid Admin_structure_structure_update_column type, " ++ string ++ " try re-running the @dillonkearns/elm-graphql CLI ")
            )


{-| Convert from the union type representing the Enum to a string that the GraphQL server will recognize.
-}
toString : Admin_structure_structure_update_column -> String
toString enum____ =
    case enum____ of
        AdminStructureId ->
            "adminStructureId"

        CreatedAt ->
            "createdAt"

        DeletedAt ->
            "deletedAt"

        Id ->
            "id"

        StructureId ->
            "structureId"


{-| Convert from a String representation to an elm representation enum.
This is the inverse of the Enum `toString` function. So you can call `toString` and then convert back `fromString` safely.

    Swapi.Enum.Episode.NewHope
        |> Swapi.Enum.Episode.toString
        |> Swapi.Enum.Episode.fromString
        == Just NewHope

This can be useful for generating Strings to use for <select> menus to check which item was selected.

-}
fromString : String -> Maybe Admin_structure_structure_update_column
fromString enumString____ =
    case enumString____ of
        "adminStructureId" ->
            Just AdminStructureId

        "createdAt" ->
            Just CreatedAt

        "deletedAt" ->
            Just DeletedAt

        "id" ->
            Just Id

        "structureId" ->
            Just StructureId

        _ ->
            Nothing
