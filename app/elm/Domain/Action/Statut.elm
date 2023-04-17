module Domain.Action.Statut exposing (StatutAction(..), printStatus, select)

import Html exposing (Html)
import UI.Select.View


type StatutAction
    = EnCours
    | Realisee
    | Abandonnee


printStatus : StatutAction -> String
printStatus status =
    case status of
        EnCours ->
            "En cours"

        Abandonnee ->
            "Abandonnée"

        Realisee ->
            "Realisée"


select : { onSelect : StatutAction -> msg, value : StatutAction } -> Html msg
select props =
    UI.Select.View.view
        { id = "select-action"
        , label = ""
        , options = [ EnCours, Realisee, Abandonnee ]
        , print = printStatus
        , onSelect = props.onSelect
        , selected = Just props.value
        }
