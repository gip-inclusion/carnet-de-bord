module Domain.Action.Id exposing (ActionId(..), decoder, printId)

import Json.Decode as Decode


type ActionId
    = ActionId String


printId : ActionId -> String
printId (ActionId id) =
    id


decoder : Decode.Decoder ActionId
decoder =
    Decode.string |> Decode.map ActionId
