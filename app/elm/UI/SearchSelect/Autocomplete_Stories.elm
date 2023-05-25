module UI.SearchSelect.Autocomplete_Stories exposing (main)

import Storybook.Component exposing (Component)
import Storybook.Controls
import UI.SearchSelect.Fixtures
import UI.SearchSelect.SearchSelect as SearchSelect


main : Component SearchSelect.Model SearchSelect.Msg
main =
    Storybook.Component.sandbox
        { controls = Storybook.Controls.none
        , init =
            ( SearchSelect.init
                { id = "id"
                , selected = Nothing
                , label = "Label"
                , searchPlaceholder = "Chercher quelque chose"
                , defaultOption = "Option par défaut"
                , api = UI.SearchSelect.Fixtures.fakeSearchApi
                , mode = SearchSelect.Autocomplete
                }
            , Cmd.none
            )
        , update = \msg model -> SearchSelect.update msg model
        , view = always <| SearchSelect.view
        }
