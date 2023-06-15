module Pages.Pro.Carnet.Action.List.Fixtures exposing (action1, action2)

import GraphQL.Enum.Action_status_enum
import Pages.Pro.Carnet.Action.List.AllActions
import Time


action1 : Pages.Pro.Carnet.Action.List.AllActions.Action
action1 =
    { id = "1"
    , description = "Première action"
    , creator =
        { lastName = "MICHEL"
        , firstName = "Daniel"
        }
    , status =
        GraphQL.Enum.Action_status_enum.Done
    , startingAt = Time.millisToPosix 0
    }


action2 : Pages.Pro.Carnet.Action.List.AllActions.Action
action2 =
    { id = "2"
    , description = "Deuxième action"
    , creator =
        { lastName = "DUPONT"
        , firstName = "Françoise"
        }
    , status =
        GraphQL.Enum.Action_status_enum.Abandonned
    , startingAt = Time.millisToPosix 1682002405000
    }
