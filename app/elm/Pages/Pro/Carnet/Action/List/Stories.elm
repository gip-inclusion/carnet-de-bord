module Pages.Pro.Carnet.Action.List.Stories exposing (main)

import Pages.Pro.Carnet.Action.List.AddForm as AddForm
import Pages.Pro.Carnet.Action.List.Fixtures as Fixtures
import Pages.Pro.Carnet.Action.List.Page as Page
import Storybook.Component exposing (Component)
import Storybook.Controls
import UI.SearchSelect.Fixtures


type Error
    = LineError
    | AddError


type alias Controls =
    { error : Maybe Error }


main : Component Page.Model Page.Msg
main =
    Storybook.Component.sandbox
        { controls =
            Storybook.Controls.new Controls
                |> Storybook.Controls.withEnum
                    { name = "error"
                    , options =
                        [ ( "Line Error", Just LineError )
                        , ( "Add Error", Just AddError )
                        ]
                    , fallback = Nothing
                    }
        , init =
            Page.init
                { actions =
                    [ Fixtures.action1
                    , Fixtures.action2
                    ]
                , targetId = "targetId"
                , theme = "theme"
                , actionSearchApi = UI.SearchSelect.Fixtures.fakeSearchApi
                }
        , update = Page.update
        , view =
            \controls model ->
                model
                    |> updateWith controls
                    |> Page.view
        }


updateWith : Controls -> Page.Model -> Page.Model
updateWith controls =
    case controls.error of
        Just LineError ->
            Page.update Page.StatusUpdateFailed >> Tuple.first

        Just AddError ->
            Page.update (Page.AddFormMsg <| AddForm.HasSubmitSucceeded True) >> Tuple.first

        _ ->
            identity
