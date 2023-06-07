module Diagnostic.UpdateSituations exposing (..)

import CdbGQL.Mutation
import CdbGQL.Scalar
import DebugView.Graphql exposing (graphqlErrorToString)
import Graphql.Http
import Graphql.Operation exposing (RootMutation)
import Graphql.SelectionSet exposing (SelectionSet)


update : String -> (Result String Bool -> msg) -> Cmd msg
update notebookId responseMsg =
    selectResult notebookId
        |> Graphql.Http.mutationRequest "/graphql"
        |> Graphql.Http.send (Result.mapError graphqlErrorToString >> responseMsg)


selectResult : String -> SelectionSet Bool RootMutation
selectResult notebookId =
    CdbGQL.Mutation.update_notebook_situations { notebookId = CdbGQL.Scalar.Uuid notebookId } dataHadBeenUpdatedSelector
