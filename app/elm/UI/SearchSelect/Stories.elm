module UI.SearchSelect.Stories exposing (Model, Msg, main)

import Html
import Html.Attributes as Attr
import Storybook.Component exposing (Component)
import Storybook.Controls
import Task
import UI.SearchSelect.Component as SearchSelect


main : Component Model Msg
main =
    Storybook.Component.sandbox
        { controls = Storybook.Controls.none
        , init =
            SearchSelect.init
                { id = "id"
                , selected = Nothing
                , optionLabel = identity
                , label = "Label"
                , searchPlaceholder = "Chercher quelque chose"
                , defaultOption = "Option par défaut"
                , api = searchApi
                }
        , update = \msg model -> SearchSelect.update msg model
        , view = always (SearchSelect.view >> List.singleton >> Html.div [ Attr.class "w-96" ])
        }


type alias Model =
    SearchSelect.Model String


searchApi : { search : String, callbackMsg : Result () (List String) -> Msg } -> Cmd Msg
searchApi { callbackMsg } =
    Task.succeed [ "Test 1", "Test 2", "Test 3" ] |> Task.attempt callbackMsg


type alias Msg =
    SearchSelect.Msg String
