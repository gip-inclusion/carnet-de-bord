module Pages.Pro.Carnet.Action.List.Fixtures exposing (action1, action2)

import CdbGQL.Enum.Action_status_enum
import CdbGQL.Scalar
import Date
import Pages.Pro.Carnet.Action.List.AllActions
import Time


action1 : Pages.Pro.Carnet.Action.List.AllActions.Action
action1 =
    { id = CdbGQL.Scalar.Uuid "1"
    , description = "Première action"
    , creator =
        { lastName = "MICHEL"
        , firstName = "Daniel"
        }
    , status =
        CdbGQL.Enum.Action_status_enum.Done
    , startingAt = Date.fromPosix Time.utc <| Time.millisToPosix 0
    }


action2 : Pages.Pro.Carnet.Action.List.AllActions.Action
action2 =
    { id = CdbGQL.Scalar.Uuid "2"
    , description = "Deuxième action"
    , creator =
        { lastName = "DUPONT"
        , firstName = "Françoise"
        }
    , status =
        CdbGQL.Enum.Action_status_enum.Abandonned
    , startingAt = Date.fromPosix Time.utc <| Time.millisToPosix 1682002405000
    }
