module Diagnostic.Situations.Mutation exposing (Input, Response, Update_notebook_situations, mutation)

{-|
This file is generated from elm/Diagnostic/Situations.graphql using `elm-gql`

Please avoid modifying directly.


@docs Input

@docs Response

@docs mutation

@docs Update_notebook_situations


-}


import Api
import GraphQL.Engine
import Json.Decode
import Json.Encode


type alias Input =
    { id : Api.Uuid }


mutation : Input -> Api.Mutation Response
mutation args =
    GraphQL.Engine.bakeToSelection
        Nothing
        (\version_ ->
            { args =
                GraphQL.Engine.inputObjectToFieldList
                    (GraphQL.Engine.inputObject "Input"
                        |> GraphQL.Engine.addField
                            "id"
                            "uuid!"
                            (Api.uuid.encode args.id)
                    )
            , body = toPayload_ version_
            , fragments = toFragments_ version_
            }
        )
        decoder_


{-  Return data  -}


type alias Response =
    { update_notebook_situations : Maybe Update_notebook_situations }


type alias Update_notebook_situations =
    { data_has_been_updated : Bool }


decoder_ : Int -> Json.Decode.Decoder Response
decoder_ version_ =
    Json.Decode.succeed Response
        |> GraphQL.Engine.versionedJsonField
            version_
            "update_notebook_situations"
            (GraphQL.Engine.decodeNullable
                (Json.Decode.succeed Update_notebook_situations
                    |> GraphQL.Engine.versionedJsonField
                        0
                        "data_has_been_updated"
                        Json.Decode.bool
                )
            )


toPayload_ : Int -> String
toPayload_ version_ =
    ((GraphQL.Engine.versionedAlias version_ "update_notebook_situations"
        ++ " (notebookId: "
     )
        ++ GraphQL.Engine.versionedName version_ "$id"
    )
        ++ ") {data_has_been_updated }"


toFragments_ : Int -> String
toFragments_ version_ =
    String.join """
""" []
