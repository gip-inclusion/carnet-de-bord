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
                    start { mode = SearchSelect.Autocomplete { maxLength = 10 } }
                        |> open
                        |> search "test"
                        |> ProgramTest.expectView (Query.has [ option "test" ])
            , test "selecting an empty option is forbidden" <|
                \_ ->
                    start { mode = SearchSelect.Autocomplete { maxLength = 10 } }
                        |> open
                        |> search " "
                        |> ProgramTest.expectView (Query.hasNot [ option " " ])
            , test "the custom option cannot be bigger than the maxLength" <|
                \_ ->
                    start { mode = SearchSelect.Autocomplete { maxLength = 4 } }
                        |> open
                        |> fillSearch "123456789"
                        |> ProgramTest.expectView (Query.has [ option "1234" ])
            , test "shows the current search before the search succeeds" <|
                \_ ->
                    start { mode = SearchSelect.Autocomplete { maxLength = 10 } }
                        |> open
                        |> fillSearch "test"
                        |> ProgramTest.expectView (Query.has [ option "test" ])
            , test "resetting the field resets the default option" <|
                \_ ->
                    start { mode = SearchSelect.Autocomplete { maxLength = 10 } }
                        |> open
                        |> search "test"
                        |> ProgramTest.update SearchSelect.Reset
                        |> open
                        |> ProgramTest.expectView (Query.hasNot [ option "test" ])
            , test "is not available in classic mode" <|
                \_ ->
                    start { mode = SearchSelect.Classic }
                        |> open
                        |> search "test"
                        |> ProgramTest.expectView (Query.hasNot [ option "test" ])
            ]
        ]


fillSearch : String -> SearchSelectTest -> SearchSelectTest
fillSearch text =
    ProgramTest.simulateDomEvent
        (Query.find [ Selector.tag "input" ])
        (Test.Html.Event.input text)


start : { a | mode : SearchSelect.Mode } -> SearchSelectTest
start { mode } =
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
            , mode = mode
            }


open : SearchSelectTest -> SearchSelectTest
open =
    ProgramTest.clickButton "Default option"


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
    fillSearch text
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
