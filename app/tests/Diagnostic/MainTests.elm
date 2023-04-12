module Diagnostic.MainTests exposing (workSituationDateFormatTests)

import Date
import Diagnostic.SocioPro exposing (workSituationDateFormat)
import Expect
import Html
import Test exposing (..)
import Test.Html.Query as Query
import Test.Html.Selector exposing (classes, tag, text)
import Time exposing (Month(..))


workSituationDateFormatTests : Test
workSituationDateFormatTests =
    describe "workSituationDateFormat"
        [ describe "when start date and end date are Nothing" <|
            [ test "returns Nothing" <|
                \_ ->
                    workSituationDateFormat Nothing Nothing
                        |> Expect.equal Nothing
            ]
        , describe "when start date is valued and end date is Nothing" <|
            [ test "returns description with start date only" <|
                \_ ->
                    workSituationDateFormat (Just (Date.fromCalendarDate 2023 Aug 22)) Nothing
                        |> Maybe.withDefault (Html.text "")
                        |> Query.fromHtml
                        |> Query.has [ text "Depuis le 22/08/2023" ]
            ]
        , describe "when start date is Nothing and end date is valued" <|
            [ test "returns description with end date only" <|
                \_ ->
                    workSituationDateFormat Nothing (Just (Date.fromCalendarDate 2023 Aug 22))
                        |> Maybe.withDefault (Html.text "")
                        |> Query.fromHtml
                        |> Query.has [ text "Jusqu'au 22/08/2023" ]
            ]
        , describe "when start date and end date are valued" <|
            [ test "returns description with start and end date, including duration" <|
                \_ ->
                    workSituationDateFormat (Just (Date.fromCalendarDate 2021 Aug 22)) (Just (Date.fromCalendarDate 2023 Aug 22))
                        |> Maybe.withDefault (Html.text "")
                        |> Query.fromHtml
                        -- Tag and classes have been added for educational purpose only, they are not really required
                        |> Query.has [ text "Du 22/08/2021 au 22/08/2023", tag "span", classes [ "italic", "font-bold" ], text "(24 mois)" ]
            ]
        ]
