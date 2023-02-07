module Diagnostic.MainTests exposing (..)

import Date
import Diagnostic.Main exposing (beneficiaryRights, workSituationDateFormat)
import Expect exposing (..)
import Html
import Html.Attributes exposing (..)
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


beneficiaryRightsTests : Test
beneficiaryRightsTests =
    describe "beneficiaryRights" <|
        List.map
            (\{ are, ass, bonus, testDescription, expected } ->
                describe testDescription <|
                    [ test "returns rights description" <|
                        \_ ->
                            beneficiaryRights are ass bonus
                                |> Query.fromHtml
                                |> Query.has [ text expected ]
                    ]
            )
            [ { are = False, ass = False, bonus = False, testDescription = "when there are no rights", expected = "" }
            , { are = True, ass = False, bonus = False, testDescription = "when there is only ARE", expected = "ARE" }
            , { are = False, ass = True, bonus = False, testDescription = "when there is only ASS", expected = "ASS" }
            , { are = False, ass = False, bonus = True, testDescription = "when there is only bonus", expected = "Prime d'activité" }
            , { are = True, ass = True, bonus = False, testDescription = "when there are ARE and ASS", expected = "ARE, ASS" }
            , { are = True, ass = False, bonus = True, testDescription = "when there are ARE and bonus", expected = "ARE, Prime d'activité" }
            , { are = False, ass = True, bonus = True, testDescription = "when there are ASS and bonus", expected = "ASS, Prime d'activité" }
            , { are = True, ass = True, bonus = True, testDescription = "when there are ARE, ASS and bonus", expected = "ARE, ASS, Prime d'activité" }
            ]
