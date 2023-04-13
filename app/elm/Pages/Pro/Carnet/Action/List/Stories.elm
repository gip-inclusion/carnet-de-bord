module Pages.Pro.Carnet.Action.List.Stories exposing (main)

import Pages.Pro.Carnet.Action.List.Page as Page
import Pages.Pro.Carnet.Action.List.Fixtures as Fixtures
import Storybook.Component exposing (Component)
import Storybook.Controls


type alias Controls =
    { error : Maybe Page.Error }


main : Component Page.Model Page.Msg
main =
    Storybook.Component.sandbox
        { controls =
            Storybook.Controls.new Controls
                |> Storybook.Controls.withEnum
                    { name = "error"
                    , options =
                        [ ( "Line Error", Just Page.LineError )
                        , ( "Add Error", Just Page.AddError )
                        ]
                    , fallback = Nothing
                    }
        , init =
            Page.init
                { actions =
                    [ Fixtures.action1
                    , Fixtures.action2
                    ]
                , theme = "theme"
                , targetId = "targetId"
                , api =
                    { url = ""
                    , token = ""
                    }
                }
        , update = Page.update
        , view =
            \controls model ->
                Page.view { model | error = controls.error }
        }
