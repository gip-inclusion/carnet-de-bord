module Domain.Action.Statut exposing (StatutAction(..), codeOf, decoder, select)

import Dict exposing (Dict)
import Extra.Json.Decode
import Html exposing (Html)
import Json.Decode as Decode
import List.Extra
import UI.Select.View


type StatutAction
    = EnCours
    | Realisee
    | Abandonnee



-- Type iterator


all : List StatutAction
all =
    next [] |> List.reverse


next : List StatutAction -> List StatutAction
next list =
    case list |> List.head of
        Nothing ->
            next (EnCours :: list)

        Just EnCours ->
            next (Realisee :: list)

        Just Realisee ->
            next (Abandonnee :: list)

        Just Abandonnee ->
            list



-- Json


decoder : Decode.Decoder StatutAction
decoder =
    Decode.string
        |> Extra.Json.Decode.mapOrFail parse


parse : String -> Result String StatutAction
parse code =
    statutParCode
        |> Dict.get code
        |> Result.fromMaybe ("'" ++ code ++ "' n'est pas un statut géré. Les status suivants sont possibles : " ++ (statutParCode |> Dict.keys |> String.join ", "))


statutParCode : Dict String StatutAction
statutParCode =
    all
        |> List.map (\statut -> ( codeOf statut, statut ))
        |> Dict.fromList


codeOf : StatutAction -> String
codeOf statut =
    case statut of
        EnCours ->
            "in_progress"

        Realisee ->
            "done"

        Abandonnee ->
            "abandonned"



--


print : StatutAction -> String
print status =
    case status of
        EnCours ->
            "En cours"

        Abandonnee ->
            "Abandonnée"

        Realisee ->
            "Realisée"


select : { id : String, onSelect : StatutAction -> msg, value : StatutAction } -> Html msg
select props =
    UI.Select.View.view
        { id = "select-action-" ++ props.id
        , label = { text = "Statut", visible = False }
        , options = all |> List.Extra.uncons |> Maybe.withDefault ( EnCours, [] )
        , onSelect = props.onSelect
        , parse = parse >> Result.toMaybe
        , print = print
        , toValue = codeOf
        , selected = Just props.value
        }
