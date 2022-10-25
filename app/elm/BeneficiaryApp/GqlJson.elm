module BeneficiaryApp.GqlJson exposing (GqlQuery, GqlQueryVariables, decodeGqlQuery, decodeGqlQueryVariables, encodeGqlQuery, encodeGqlQueryVariables)

import Json.Decode exposing (field)
import Json.Encode


type alias GqlQuery =
    { query : String
    , operationName : String
    , variables : GqlQueryVariables
    }


type alias GqlQueryVariables =
    { id : String
    }


decodeGqlQuery : Json.Decode.Decoder GqlQuery
decodeGqlQuery =
    Json.Decode.map3 GqlQuery
        (field "query" Json.Decode.string)
        (field "operationName" Json.Decode.string)
        (field "variables" decodeGqlQueryVariables)


decodeGqlQueryVariables : Json.Decode.Decoder GqlQueryVariables
decodeGqlQueryVariables =
    Json.Decode.map GqlQueryVariables
        (field "id" Json.Decode.string)


encodeGqlQuery : GqlQuery -> Json.Encode.Value
encodeGqlQuery record =
    Json.Encode.object
        [ ( "query", Json.Encode.string <| record.query )
        , ( "operationName", Json.Encode.string <| record.operationName )
        , ( "variables", encodeGqlQueryVariables <| record.variables )
        ]


encodeGqlQueryVariables : GqlQueryVariables -> Json.Encode.Value
encodeGqlQueryVariables record =
    Json.Encode.object
        [ ( "id", Json.Encode.string <| record.id )
        ]
