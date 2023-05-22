-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Enum.Professional_project_select_column exposing (..)

import Json.Decode as Decode exposing (Decoder)


{-| select columns of table "professional\_project"

  - ContractTypeId - column name
  - CreatedAt - column name
  - EmploymentTypeId - column name
  - HourlyRate - column name
  - Id - column name
  - MobilityRadius - column name
  - NotebookId - column name
  - RomeCodeId - column name
  - UpdatedAt - column name
  - UpdatedBy - column name

-}
type Professional_project_select_column
    = ContractTypeId
    | CreatedAt
    | EmploymentTypeId
    | HourlyRate
    | Id
    | MobilityRadius
    | NotebookId
    | RomeCodeId
    | UpdatedAt
    | UpdatedBy


list : List Professional_project_select_column
list =
    [ ContractTypeId, CreatedAt, EmploymentTypeId, HourlyRate, Id, MobilityRadius, NotebookId, RomeCodeId, UpdatedAt, UpdatedBy ]


decoder : Decoder Professional_project_select_column
decoder =
    Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "contractTypeId" ->
                        Decode.succeed ContractTypeId

                    "createdAt" ->
                        Decode.succeed CreatedAt

                    "employmentTypeId" ->
                        Decode.succeed EmploymentTypeId

                    "hourlyRate" ->
                        Decode.succeed HourlyRate

                    "id" ->
                        Decode.succeed Id

                    "mobilityRadius" ->
                        Decode.succeed MobilityRadius

                    "notebookId" ->
                        Decode.succeed NotebookId

                    "romeCodeId" ->
                        Decode.succeed RomeCodeId

                    "updatedAt" ->
                        Decode.succeed UpdatedAt

                    "updatedBy" ->
                        Decode.succeed UpdatedBy

                    _ ->
                        Decode.fail ("Invalid Professional_project_select_column type, " ++ string ++ " try re-running the @dillonkearns/elm-graphql CLI ")
            )


{-| Convert from the union type representing the Enum to a string that the GraphQL server will recognize.
-}
toString : Professional_project_select_column -> String
toString enum____ =
    case enum____ of
        ContractTypeId ->
            "contractTypeId"

        CreatedAt ->
            "createdAt"

        EmploymentTypeId ->
            "employmentTypeId"

        HourlyRate ->
            "hourlyRate"

        Id ->
            "id"

        MobilityRadius ->
            "mobilityRadius"

        NotebookId ->
            "notebookId"

        RomeCodeId ->
            "romeCodeId"

        UpdatedAt ->
            "updatedAt"

        UpdatedBy ->
            "updatedBy"


{-| Convert from a String representation to an elm representation enum.
This is the inverse of the Enum `toString` function. So you can call `toString` and then convert back `fromString` safely.

    Swapi.Enum.Episode.NewHope
        |> Swapi.Enum.Episode.toString
        |> Swapi.Enum.Episode.fromString
        == Just NewHope

This can be useful for generating Strings to use for <select> menus to check which item was selected.

-}
fromString : String -> Maybe Professional_project_select_column
fromString enumString____ =
    case enumString____ of
        "contractTypeId" ->
            Just ContractTypeId

        "createdAt" ->
            Just CreatedAt

        "employmentTypeId" ->
            Just EmploymentTypeId

        "hourlyRate" ->
            Just HourlyRate

        "id" ->
            Just Id

        "mobilityRadius" ->
            Just MobilityRadius

        "notebookId" ->
            Just NotebookId

        "romeCodeId" ->
            Just RomeCodeId

        "updatedAt" ->
            Just UpdatedAt

        "updatedBy" ->
            Just UpdatedBy

        _ ->
            Nothing
