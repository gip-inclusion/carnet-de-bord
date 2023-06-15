module Extra.GraphQL exposing (postOperation)

import GraphQL.Errors
import GraphQL.Operation
import GraphQL.Response
import Http


internalPostOperation : GraphQL.Operation.Operation any GraphQL.Errors.Errors data -> (Result Http.Error (GraphQL.Response.Response GraphQL.Errors.Errors data) -> msg) -> Cmd msg
internalPostOperation operation msg =
    Http.post
        { url = "/graphql"
        , body = Http.jsonBody (GraphQL.Operation.encode operation)
        , expect = Http.expectJson msg (GraphQL.Response.decoder operation)
        }


postOperation : GraphQL.Operation.Operation any GraphQL.Errors.Errors data -> (Result Http.Error data -> msg) -> Cmd msg
postOperation operation msg =
    internalPostOperation operation
        (msg
            << Result.andThen
                (\response ->
                    case response of
                        GraphQL.Response.Data data ->
                            Ok data

                        GraphQL.Response.Errors _ _ ->
                            Err (Http.BadBody "bad graphql response")
                )
        )
