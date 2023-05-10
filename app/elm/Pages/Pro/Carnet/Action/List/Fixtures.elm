module Pages.Pro.Carnet.Action.List.Fixtures exposing (action1, action2)

import Date
import Domain.Action.Id exposing (ActionId(..))
import Domain.Action.Status
import Pages.Pro.Carnet.Action.List.AllActions
import Time


action1 : Pages.Pro.Carnet.Action.List.AllActions.Action
action1 =
    { id = ActionId "1"
    , description = "Première action"
    , creator =
        { lastName = "MICHEL"
        , firstName = "Daniel"
        }
    , statut = Domain.Action.Status.Done
    , startingAt = Date.fromPosix Time.utc <| Time.millisToPosix 0
    }


action2 : Pages.Pro.Carnet.Action.List.AllActions.Action
action2 =
    { id = ActionId "2"
    , description = "Deuxième action"
    , creator =
        { lastName = "DUPONT"
        , firstName = "Françoise"
        }
    , statut = Domain.Action.Status.Abandonned
    , startingAt = Date.fromPosix Time.utc <| Time.millisToPosix 1682002405000
    }
