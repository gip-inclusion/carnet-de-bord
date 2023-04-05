module PersonalInfo.MainTests exposing (beneficiaryRightsTests)

import PersonalInfo.Main exposing (beneficiaryRights)
import Test exposing (..)
import Test.Html.Query as Query
import Test.Html.Selector exposing (text)


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
