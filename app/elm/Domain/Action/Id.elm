module Domain.Action.Id exposing (ActionId(..), printId)


type ActionId
    = ActionId String


printId : ActionId -> String
printId (ActionId id) =
    id
