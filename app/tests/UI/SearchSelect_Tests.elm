module UI.SearchSelect_Tests exposing (SearchSelectTest, suite)

import Effect
import Http
import ProgramTest
import Test exposing (..)
import Test.Html.Event
import Test.Html.Query as Query
import Test.Html.Selector as Selector
import UI.SearchSelect.Fixtures
import UI.SearchSelect.SearchSelect as SearchSelect


suite : Test
suite =
    describe "Search Select"
        [ describe "custom option"
            [ test "shows the current search in autocomplete mode" <|
                \_ ->
                    ProgramTest.createElement
                        { init = SearchSelect.init >> (\model -> ( model, Effect.none ))
                        , update = \model msg -> SearchSelect.update model msg |> Tuple.mapSecond Effect.fromCmd
                        , view = SearchSelect.view
                        }
                        |> ProgramTest.start
                            { id = "an id"
                            , selected = Nothing
                            , api = UI.SearchSelect.Fixtures.fakeSearchApi
                            , label = "Label"
                            , searchPlaceholder = "Placeholder"
                            , defaultOption = "Default option"
                            , mode = SearchSelect.Autocomplete
                            }
                        |> ProgramTest.clickButton "Default option"
                        |> search "test"
                        |> ProgramTest.expectView (Query.has [ option "test" ])
            , test "is not available in classic mode" <|
                \_ ->
                    ProgramTest.createElement
                        { init = SearchSelect.init >> (\model -> ( model, Effect.none ))
                        , update = \model msg -> SearchSelect.update model msg |> Tuple.mapSecond Effect.fromCmd
                        , view = SearchSelect.view
                        }
                        |> ProgramTest.start
                            { id = "an id"
                            , selected = Nothing
                            , api = UI.SearchSelect.Fixtures.fakeSearchApi
                            , label = "Label"
                            , searchPlaceholder = "Placeholder"
                            , defaultOption = "Default option"
                            , mode = SearchSelect.Classic
                            }
                        |> ProgramTest.clickButton "Default option"
                        |> search "test"
                        |> ProgramTest.expectView (Query.hasNot [ option "test" ])
            ]
        ]



-- TODO: virer ça et bouger option dans l'utilitaire


option : String -> Selector.Selector
option text =
    Selector.all
        [ Selector.tag "li"
        , Selector.exactText text
        ]


type alias SearchSelectTest =
    ProgramTest.ProgramTest SearchSelect.Model SearchSelect.Msg (Effect.Effect SearchSelect.Msg)


search : String -> SearchSelectTest -> SearchSelectTest
search text =
    ProgramTest.simulateDomEvent
        (Query.find [ Selector.tag "input" ])
        (Test.Html.Event.input text)
        >> ProgramTest.update (SearchSelect.Fetched (generate3OptionsFor text))


generate3OptionsFor : String -> Result Http.Error (List { id : String, label : String })
generate3OptionsFor text =
    List.range 1 3
        |> List.map
            (\i ->
                { id = text ++ String.fromInt i
                , label = text ++ " " ++ String.fromInt i
                }
            )
        |> Ok
