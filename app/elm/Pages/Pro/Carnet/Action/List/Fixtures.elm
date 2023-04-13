module Pages.Pro.Carnet.Action.List.Fixtures exposing (action1, action2)

import Date
import Domain.Action.Id exposing (ActionId(..))
import Domain.Action.Statut
import Pages.Pro.Carnet.Action.List.AllActions
import Time


action1 : Pages.Pro.Carnet.Action.List.AllActions.Action
action1 =
    { id = ActionId "1"
    , description = "Première action"
    , creePar =
        { lastName = "MICHEL"
        , firstName = "Daniel"
        }
    , statut = Domain.Action.Statut.Realisee
    , dateDeDebut = Date.fromPosix Time.utc <| Time.millisToPosix 0
    }


action2 : Pages.Pro.Carnet.Action.List.AllActions.Action
action2 =
    { id = ActionId "2"
    , description = "Deuxième action"
    , creePar =
        { lastName = "DUPONT"
        , firstName = "Françoise"
        }
    , statut = Domain.Action.Statut.Abandonnee
    , dateDeDebut = Date.fromPosix Time.utc <| Time.millisToPosix 1682002405000
    }
