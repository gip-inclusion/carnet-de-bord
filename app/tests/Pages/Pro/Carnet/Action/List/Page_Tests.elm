module Pages.Pro.Carnet.Action.List.Page_Tests exposing (suite)

import Domain.Action.Status
import Html.Attributes as Attr
import Pages.Pro.Carnet.Action.List.Fixtures as Fixtures
import Pages.Pro.Carnet.Action.List.Page as Page
import Test exposing (..)
import Test.Html.Query as Query
import Test.Html.Selector as Selector exposing (text)
import UI.SearchSelect.Fixtures


suite : Test
suite =
    describe "Action List"
        [ test "empty list shows placeholder" <|
            \_ ->
                initModel
                    |> Page.view
                    |> Query.fromHtml
                    |> Query.has [ text "Aucune action entreprise pour le moment." ]
        , describe "Action status update"
            [ test "shows an alert message after failure" <|
                \_ ->
                    initModel
                        |> updateModel Page.StatusUpdateFailed
                        |> Page.view
                        |> Query.fromHtml
                        |> Query.has [ Selector.attribute <| Attr.attribute "role" "alert" ]
            , test "changing status hides alert" <|
                \_ ->
                    initModel
                        |> updateModel (Page.Refreshed [ Fixtures.action1 ])
                        |> updateModel Page.StatusUpdateFailed
                        |> updateModel (Page.UpdateStatus Fixtures.action1.id Domain.Action.Status.InProgress)
                        |> Page.view
                        |> Query.fromHtml
                        |> Query.hasNot [ Selector.attribute <| Attr.attribute "role" "alert" ]
            ]
        ]


initModel : Page.Model
initModel =
    Page.init
        { actions = []
        , theme = "theme"
        , targetId = "targetId"
        , actionSearchApi = UI.SearchSelect.Fixtures.fakeSearchApi
        }
        |> Tuple.first


updateModel : Page.Msg -> Page.Model -> Page.Model
updateModel message =
    Page.update message >> Tuple.first
