module Extra.GraphQL exposing (Op, send)

import Extra.Result
import GraphQL.Errors exposing (Error, Errors, Location, PathSegment(..))
import GraphQL.Operation as Operation exposing (Operation)
import GraphQL.Response as Response exposing (Response)
import Http
import Json.Encode as Json
import Json.Print


type alias Op type_ data =
    Operation type_ Errors data


send : Op type_ data -> (Result Http.Error data -> msg) -> Cmd msg
send operation msg =
    Http.post
        { url = "/graphql"
        , body = Http.jsonBody (Operation.encode operation)
        , expect = Http.expectJson (simplifyResult >> msg) (Response.decoder operation)
        }


simplifyResult : Result Http.Error (Response Errors data) -> Result Http.Error data
simplifyResult =
    Result.andThen (Response.toResult >> Result.mapError (Http.BadBody << printGqlErrors))


printGqlErrors : Errors -> String
printGqlErrors errors =
    Json.list encodeGqlError errors
        |> Json.Print.prettyValue { indent = 2, columns = 120 }
        |> Extra.Result.fold { onError = identity, onOk = identity }


encodeGqlError : Error -> Json.Value
encodeGqlError error =
    Json.object
        [ ( "message", Json.string error.message )
        , ( "locations", error.locations |> Maybe.map (Json.list encodeLocation) |> Maybe.withDefault Json.null )
        , ( "path", error.path |> Maybe.map (Json.list encodePathSegment) |> Maybe.withDefault Json.null )
        ]


encodePathSegment : PathSegment -> Json.Value
encodePathSegment path =
    case path of
        FieldName value ->
            Json.string value

        ListIndex value ->
            Json.int value


encodeLocation : Location -> Json.Value
encodeLocation location =
    Json.object
        [ ( "line", Json.int location.line )
        , ( "column", Json.int location.column )
        ]
