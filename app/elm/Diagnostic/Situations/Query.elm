module Diagnostic.Situations.Query exposing (Creator, Input, Notebook_situation, Orientation_manager, Professional, RefSituation, Response, Structure, query)

{-|
This file is generated from elm/Diagnostic/Situations.graphql using `elm-gql`

Please avoid modifying directly.


@docs Input

@docs Response

@docs query

@docs Orientation_manager, Structure, Professional, Creator, RefSituation, Notebook_situation


-}


import Api
import GraphQL.Engine
import Json.Decode
import Json.Encode


type alias Input =
    { id : Api.Uuid }


query : Input -> Api.Query Response
query args =
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
    { notebook_situation : List Notebook_situation }


type alias Notebook_situation =
    { creator : Maybe Creator
    , createdAt : Api.Timestamptz
    , refSituation : Maybe RefSituation
    }


type alias RefSituation =
    { description : String, theme : String }


type alias Creator =
    { orientation_manager : Maybe Orientation_manager
    , professional : Maybe Professional
    }


type alias Professional =
    { structure : Structure, lastname : String, firstname : String }


type alias Structure =
    { name : Api.Citext }


type alias Orientation_manager =
    { lastname : Maybe String, firstname : Maybe String }


decoder_ : Int -> Json.Decode.Decoder Response
decoder_ version_ =
    Json.Decode.succeed Response
        |> GraphQL.Engine.versionedJsonField
            version_
            "notebook_situation"
            (Json.Decode.list
                (Json.Decode.succeed Notebook_situation
                    |> GraphQL.Engine.versionedJsonField
                        0
                        "creator"
                        (GraphQL.Engine.decodeNullable
                            (Json.Decode.succeed Creator
                                |> GraphQL.Engine.versionedJsonField
                                    0
                                    "orientation_manager"
                                    (GraphQL.Engine.decodeNullable
                                        (Json.Decode.succeed Orientation_manager
                                            |> GraphQL.Engine.versionedJsonField
                                                0
                                                "lastname"
                                                (GraphQL.Engine.decodeNullable
                                                    Json.Decode.string
                                                )
                                            |> GraphQL.Engine.versionedJsonField
                                                0
                                                "firstname"
                                                (GraphQL.Engine.decodeNullable
                                                    Json.Decode.string
                                                )
                                        )
                                    )
                                |> GraphQL.Engine.versionedJsonField
                                    0
                                    "professional"
                                    (GraphQL.Engine.decodeNullable
                                        (Json.Decode.succeed Professional
                                            |> GraphQL.Engine.versionedJsonField
                                                0
                                                "structure"
                                                (Json.Decode.succeed Structure
                                                    |> GraphQL.Engine.versionedJsonField
                                                        0
                                                        "name"
                                                        Api.citext.decoder
                                                )
                                            |> GraphQL.Engine.versionedJsonField
                                                0
                                                "lastname"
                                                Json.Decode.string
                                            |> GraphQL.Engine.versionedJsonField
                                                0
                                                "firstname"
                                                Json.Decode.string
                                        )
                                    )
                            )
                        )
                    |> GraphQL.Engine.versionedJsonField
                        0
                        "createdAt"
                        Api.timestamptz.decoder
                    |> GraphQL.Engine.versionedJsonField
                        0
                        "refSituation"
                        (GraphQL.Engine.decodeNullable
                            (Json.Decode.succeed RefSituation
                                |> GraphQL.Engine.versionedJsonField
                                    0
                                    "description"
                                    Json.Decode.string
                                |> GraphQL.Engine.versionedJsonField
                                    0
                                    "theme"
                                    Json.Decode.string
                            )
                        )
                )
            )


toPayload_ : Int -> String
toPayload_ version_ =
    ((GraphQL.Engine.versionedAlias version_ "notebook_situation"
        ++ " (where: {notebookId: {_eq: "
     )
        ++ GraphQL.Engine.versionedName version_ "$id"
    )
        ++ """}}) {creator {orientation_manager {lastname
firstname }
professional {structure {name }
lastname
firstname } }
createdAt
refSituation {description
theme } }"""


toFragments_ : Int -> String
toFragments_ version_ =
    String.join """
""" []
