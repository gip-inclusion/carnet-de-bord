module Diagnostic.AllSituations exposing
    ( PersonalSituation
    , fetchByNotebookId
    , syncWithPE
    )

import Api
import CdbGQL.Mutation
import CdbGQL.Object.UpdateNotebookSituationsOutput as Output
import CdbGQL.Scalar
import Date exposing (Date)
import DebugView.Graphql exposing (graphqlErrorToString)
import Diagnostic.Situations.Mutation
import Diagnostic.Situations.Query exposing (Response)
import Domain.Account exposing (Account)
import Extra.Date
import Graphql.Http
import Graphql.Operation exposing (RootMutation)
import Graphql.OptionalArgument exposing (OptionalArgument(..))
import Graphql.SelectionSet exposing (SelectionSet, nonNullOrFail)



-- Synchronize


syncWithPE : String -> (Result String Bool -> msg) -> Cmd msg
syncWithPE notebookId responseMsg =
    Api.mutation (Diagnostic.Situations.Mutation.mutation { id = Api.Uuid notebookId })
        { headers = []
        , url = "/graphql"
        , timeout = Nothing
        , tracker = Nothing
        }
        |> Cmd.map
            (Result.mapError Debug.toString
                >> Result.map extractDataHasBeenUpdated
                >> responseMsg
            )


extractDataHasBeenUpdated : { update_notebook_situations : Maybe { data_has_been_updated : Bool } } -> Bool
extractDataHasBeenUpdated response =
    response.update_notebook_situations
        |> Maybe.map (\a -> a.data_has_been_updated)
        |> Maybe.withDefault False



-- Fetch


type alias PersonalSituation =
    { theme : String
    , description : String
    , createdAt : Date
    , creator : Maybe Diagnostic.Situations.Query.Creator
    }


fetchByNotebookId : String -> (Result String (List PersonalSituation) -> msg) -> Cmd msg
fetchByNotebookId notebookId responseMsg =
    Api.query
        (Diagnostic.Situations.Query.query { id = Api.Uuid notebookId })
        { headers = []
        , url = "/graphql"
        , timeout = Nothing
        , tracker = Nothing
        }
        |> Cmd.map
            (\result ->
                responseMsg <|
                    case result of
                        Err error ->
                            Err <| Debug.toString error

                        Ok response ->
                            Ok <| toCore response
            )


toCore : Response -> List PersonalSituation
toCore response =
    response.notebook_situation |> List.map toSingleCore


toSingleCore : Diagnostic.Situations.Query.Notebook_situation -> PersonalSituation
toSingleCore apiSituation =
    { theme =
        apiSituation.refSituation
            |> Maybe.map .theme
            |> Maybe.withDefault ""
    , description =
        apiSituation.refSituation
            |> Maybe.map .description
            |> Maybe.withDefault ""
    , createdAt =
        apiSituation.createdAt
            |> (\(Api.Timestamptz raw) ->
                    Extra.Date.parseTimestamp raw
                        |> Result.withDefault (Date.fromRataDie 0)
               )
    , creator = apiSituation.creator
    }
