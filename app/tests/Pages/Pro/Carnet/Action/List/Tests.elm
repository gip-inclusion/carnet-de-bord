module Pages.Pro.Carnet.Action.List.Tests exposing (suite)

import Domain.Action.Id
import Domain.Action.Status
import Html
import Html.Attributes as Attr
import Pages.Pro.Carnet.Action.List.Fixtures as Fixtures
import Pages.Pro.Carnet.Action.List.Page as Page
import Test exposing (..)
import Test.Html.Query
import Test.Html.Selector exposing (all, tag, text)
import UI.SearchSelect.Component


suite : Test
suite =
    describe "Action List"
        [ test "empty list shows placeholder" <|
            \_ ->
                initModel
                    |> Page.view
                    |> Test.Html.Query.fromHtml
                    |> Test.Html.Query.has [ text "Aucune action entreprise pour le moment." ]
        , describe "Action status update"
            [ test "shows an alert message after failure" <|
                \_ ->
                    initModel
                        |> updateModel Page.StatusUpdateFailed
                        |> Page.view
                        |> Test.Html.Query.fromHtml
                        |> Test.Html.Query.has [ Test.Html.Selector.attribute <| Attr.attribute "role" "alert" ]
            , test "changing status hides alert" <|
                \_ ->
                    initModel
                        |> updateModel (Page.Refreshed [ Fixtures.action1 ])
                        |> updateModel Page.StatusUpdateFailed
                        |> updateModel (Page.ChangedStatus (Fixtures.action1.id |> Domain.Action.Id.printId) Domain.Action.Status.InProgress)
                        |> Page.view
                        |> Test.Html.Query.fromHtml
                        |> Test.Html.Query.hasNot [ Test.Html.Selector.attribute <| Attr.attribute "role" "alert" ]
            , test "hides create errors also" <|
                \_ ->
                    initModel
                        |> updateModel (Page.Refreshed [ Fixtures.action1 ])
                        |> updateModel Page.AddFailed
                        |> updateModel (Page.ChangedStatus (Fixtures.action1.id |> Domain.Action.Id.printId) Domain.Action.Status.InProgress)
                        |> Page.view
                        |> Test.Html.Query.fromHtml
                        |> Test.Html.Query.find [ Test.Html.Selector.attribute <| Attr.attribute "role" "alert" ]
                        |> Test.Html.Query.hasNot [ text "ajout" ]
            ]
        , describe "Action creation"
            [ test "calls a port to add it via svelte" <|
                \_ ->
                    initModel
                        |> updateModel Page.Add
                        |> updateModel
                            (Page.Refreshed
                                [ Fixtures.action1
                                , Fixtures.action2
                                ]
                            )
                        |> Page.view
                        |> Test.Html.Query.fromHtml
                        |> Test.Html.Query.contains [ Html.text Fixtures.action2.description ]
            , test "shows an alert after failure" <|
                \_ ->
                    initModel
                        |> updateModel Page.AddFailed
                        |> Page.view
                        |> Test.Html.Query.fromHtml
                        |> Test.Html.Query.find [ Test.Html.Selector.attribute <| Attr.attribute "role" "alert" ]
                        |> Test.Html.Query.has [ text "ajout" ]
            , test "hides status update errors" <|
                \_ ->
                    initModel
                        |> updateModel Page.StatusUpdateFailed
                        |> updateModel Page.Add
                        |> Page.view
                        |> Test.Html.Query.fromHtml
                        |> Test.Html.Query.hasNot [ Test.Html.Selector.attribute <| Attr.attribute "role" "alert" ]
            , test "hides add errors" <|
                \_ ->
                    initModel
                        |> updateModel Page.AddFailed
                        |> updateModel Page.Add
                        |> Page.view
                        |> Test.Html.Query.fromHtml
                        |> Test.Html.Query.hasNot [ Test.Html.Selector.attribute <| Attr.attribute "role" "alert" ]
            ]
        , describe "Add button"
            [ test "is disabled at first" <|
                \_ ->
                    initModel
                        |> Page.view
                        |> Test.Html.Query.fromHtml
                        |> Test.Html.Query.find [ all [ tag "button", Test.Html.Selector.attribute <| Attr.disabled True ] ]
                        |> Test.Html.Query.has [ text "Ajouter" ]
            , test "is enabled after option is selected" <|
                \_ ->
                    initModel
                        |> updateModel (Page.Refreshed [ Fixtures.action1 ])
                        |> updateModel
                            (Page.ActionSelectMsg
                                (UI.SearchSelect.Component.Select
                                    { id = "Id" |> Domain.Action.Id.ActionId
                                    , description = "an action"
                                    }
                                )
                            )
                        |> Page.view
                        |> Test.Html.Query.fromHtml
                        |> Test.Html.Query.find [ all [ tag "button", Test.Html.Selector.attribute <| Attr.disabled False ] ]
                        |> Test.Html.Query.has [ text "Ajouter" ]
            ]
        ]


initModel : Page.Model
initModel =
    Page.init
        { actions = []
        , theme = "theme"
        , targetId = "targetId"
        , api = { url = "", token = "" }
        }
        |> Tuple.first


updateModel : Page.Msg -> Page.Model -> Page.Model
updateModel message =
    Page.update message >> Tuple.first
