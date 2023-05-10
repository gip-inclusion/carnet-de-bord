module Domain.Action.Status exposing (ActionStatus(..), codeOf, decoder, select)

import Dict exposing (Dict)
import Extra.Json.Decode
import Html exposing (Html)
import Json.Decode as Decode
import List.Extra
import UI.Select.View


type ActionStatus
    = InProgress
    | Done
    | Abandonned



-- Type iterator


all : List ActionStatus
all =
    next [] |> List.reverse


next : List ActionStatus -> List ActionStatus
next list =
    case list |> List.head of
        Nothing ->
            next (InProgress :: list)

        Just InProgress ->
            next (Done :: list)

        Just Done ->
            next (Abandonned :: list)

        Just Abandonned ->
            list



-- Json


decoder : Decode.Decoder ActionStatus
decoder =
    Decode.string
        |> Extra.Json.Decode.mapOrFail parse


parse : String -> Result String ActionStatus
parse code =
    statusByCode
        |> Dict.get code
        |> Result.fromMaybe ("'" ++ code ++ "' n'est pas un statut géré. Les statuts suivants sont possibles : " ++ (statusByCode |> Dict.keys |> String.join ", "))


statusByCode : Dict String ActionStatus
statusByCode =
    all
        |> List.map (\statut -> ( codeOf statut, statut ))
        |> Dict.fromList


codeOf : ActionStatus -> String
codeOf statut =
    case statut of
        InProgress ->
            "in_progress"

        Done ->
            "done"

        Abandonned ->
            "abandonned"


toFrenchLabel : ActionStatus -> String
toFrenchLabel status =
    case status of
        InProgress ->
            "En cours"

        Abandonned ->
            "Abandonnée"

        Done ->
            "Realisée"


select : { id : String, onSelect : ActionStatus -> msg, value : ActionStatus } -> Html msg
select props =
    UI.Select.View.view
        { id = "select-action-" ++ props.id
        , label = { text = "Statut", visible = False }
        , options = all |> List.Extra.uncons |> Maybe.withDefault ( InProgress, [] )
        , onSelect = props.onSelect
        , parse = parse >> Result.toMaybe
        , print = toFrenchLabel
        , toValue = codeOf
        , selected = Just props.value
        }
