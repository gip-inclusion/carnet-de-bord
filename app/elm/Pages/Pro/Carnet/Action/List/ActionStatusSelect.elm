module Pages.Pro.Carnet.Action.List.ActionStatusSelect exposing (select)

import CdbGQL.Enum.Action_status_enum as Gql exposing (Action_status_enum)
import Html exposing (Html)
import List.Extra
import UI.Select.View




select : { id : String, onSelect : Action_status_enum -> msg, value : Action_status_enum } -> Html msg
select props =
    UI.Select.View.view
        { id = "select-action-" ++ props.id
        , label = { text = "Statut", visible = False }
        , options =
            Gql.list
                |> List.Extra.uncons
                |> Maybe.withDefault ( Gql.In_progress, [] )
        , onSelect = props.onSelect
        , parse = Gql.fromString
        , print = toFrenchLabel
        , toValue = Gql.toString
        , selected = Just props.value
        }

toFrenchLabel : Action_status_enum -> String
toFrenchLabel status =
    case status of
        Gql.In_progress ->
            "En cours"

        Gql.Abandonned ->
            "Abandonnée par le bénéficiaire"

        Gql.Done ->
            "Realisée"

        Gql.Canceled ->
            "Annulée par la structure"

        Gql.Planned ->
            "En projet"

        Gql.Standby ->
            "En attente"
