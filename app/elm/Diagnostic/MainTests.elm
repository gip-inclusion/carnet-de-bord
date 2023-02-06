module Diagnostic.MainTests exposing (..)

import Date
import Diagnostic.Main exposing (workSituationDateFormat)
import Expect exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Test exposing (..)
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
                        |> Expect.equal (Just (span [ class "text-sm" ] [ text "Depuis le 22/09/2023" ]))
            ]
        , describe "when start date is Nothing and end date is valued" <|
            [ test "returns description with end date only" <|
                \_ ->
                    workSituationDateFormat Nothing (Just (Date.fromCalendarDate 2023 Aug 22))
                        |> Expect.equal (Just (span [ class "text-sm" ] [ text "Jusqu'au 22/09/2023" ]))
            ]
        , describe "when start date and end date are valued" <|
            [ test "returns description with start and end date, including duration" <|
                \_ ->
                    workSituationDateFormat (Just (Date.fromCalendarDate 2021 Aug 22)) (Just (Date.fromCalendarDate 2023 Aug 22))
                        |> Expect.equal (Just (span [ class "text-sm" ] [ text "Jusqu'au 22/09/2023" ]))
            ]
        ]
