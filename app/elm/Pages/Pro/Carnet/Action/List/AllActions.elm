module Pages.Pro.Carnet.Action.List.AllActions exposing (Action, Createur, fetchAllByTargetId)

import Api exposing (Api)
import Date
import Domain.Action.Id exposing (ActionId)
import Domain.Action.Statut exposing (StatutAction)
import Extra.Date
import Http
import Json.Decode as Decode
import Json.Decode.Pipeline as Decode
import Json.Encode as Json


type alias Action =
    { id : ActionId
    , description : String
    , statut : StatutAction
    , dateDeDebut : Date.Date
    , creePar : Createur
    }


type alias Createur =
    { firstName : String, lastName : String }


decoder : Decode.Decoder Action
decoder =
    Decode.succeed Action
        |> Decode.required "id" Domain.Action.Id.decoder
        |> Decode.required "action" Decode.string
        |> Decode.required "status" Domain.Action.Statut.decoder
        |> Decode.required "createdAt" Extra.Date.decoder
        |> Decode.required "creator" creeParDecoder


creeParDecoder : Decode.Decoder Createur
creeParDecoder =
    Decode.keyValuePairs (Decode.maybe createurDecoder)
        |> Decode.andThen
            (List.filterMap Tuple.second
                >> List.head
                >> Maybe.map Decode.succeed
                >> Maybe.withDefault
                    (Decode.fail "Une action doit avoir un créateur professional ou orientation manager")
            )


createurDecoder : Decode.Decoder Createur
createurDecoder =
    Decode.succeed Createur
        |> Decode.required "firstname" Decode.string
        |> Decode.required "lastname" Decode.string


fetchAllByTargetId : { id : String, api : Api, responseMsg : Result Http.Error (List Action) -> msg } -> Cmd msg
fetchAllByTargetId { id, responseMsg, api } =
    let
        query =
            """
query GetActionsByTargetId($id: uuid!) {
  target: notebook_target_by_pk(id: $id) {
    id
    actions {
      id
      action
      status
      createdAt
      creator {
        orientation_manager {
          firstname, lastname
        }
        professional {
          firstname, lastname
        }
      }
    }
  }
}
            """
    in
    Http.request
        { method = "POST"
        , url = api.url
        , headers =
            [ Http.header "Authorization" ("Bearer " ++ api.token) ]
        , body =
            Http.jsonBody
                (Json.object
                    [ ( "query", Json.string query )
                    , ( "variables"
                      , Json.object
                            [ ( "id", Json.string id )
                            ]
                      )
                    ]
                )
        , expect =
            Http.expectJson
                responseMsg
                (Decode.at [ "data", "target", "actions" ]
                    (Decode.list decoder)
                )
        , timeout = Nothing
        , tracker = Nothing
        }
