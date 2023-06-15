module Pages.Pro.Carnet.Action.List.ActionStatusSelect exposing (select)

import GraphQL.Enum.Action_status_enum
import Html exposing (Html)
import UI.Select.View


statusList : ( GraphQL.Enum.Action_status_enum.Action_status_enum, List GraphQL.Enum.Action_status_enum.Action_status_enum )
statusList =
    ( GraphQL.Enum.Action_status_enum.Abandonned
    , [ GraphQL.Enum.Action_status_enum.Canceled
      , GraphQL.Enum.Action_status_enum.Done
      , GraphQL.Enum.Action_status_enum.In_progress
      , GraphQL.Enum.Action_status_enum.Planned
      , GraphQL.Enum.Action_status_enum.Standby
      ]
    )


select : { id : String, onSelect : GraphQL.Enum.Action_status_enum.Action_status_enum -> msg, value : GraphQL.Enum.Action_status_enum.Action_status_enum } -> Html msg
select props =
    UI.Select.View.view
        { id = "select-action-" ++ props.id
        , label = { text = "Statut", visible = False }
        , options = statusList
        , onSelect = props.onSelect
        , parse = GraphQL.Enum.Action_status_enum.fromString
        , print = toFrenchLabel
        , toValue = GraphQL.Enum.Action_status_enum.toString
        , selected = Just props.value
        }


toFrenchLabel : GraphQL.Enum.Action_status_enum.Action_status_enum -> String
toFrenchLabel status =
    case status of
        GraphQL.Enum.Action_status_enum.In_progress ->
            "En cours"

        GraphQL.Enum.Action_status_enum.Abandonned ->
            "Abandonnée par le bénéficiaire"

        GraphQL.Enum.Action_status_enum.Done ->
            "Realisée"

        GraphQL.Enum.Action_status_enum.Canceled ->
            "Annulée par la structure"

        GraphQL.Enum.Action_status_enum.Planned ->
            "En projet"

        GraphQL.Enum.Action_status_enum.Standby ->
            "En attente"
