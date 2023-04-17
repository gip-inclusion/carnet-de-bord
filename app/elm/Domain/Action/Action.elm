module Domain.Action.Action exposing (Action)

import Date
import Domain.Action.Id exposing (ActionId)
import Domain.Action.Statut exposing (StatutAction)
import Domain.Person exposing (Person)


type alias Action =
    { id : ActionId
    , description : String -- Est-ce qu'il y a un meilleur type ?
    , creePar : Person
    , statut : StatutAction
    , dateDeDebut : Date.Date
    }
