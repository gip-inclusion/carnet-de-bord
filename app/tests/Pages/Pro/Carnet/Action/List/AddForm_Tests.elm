module Pages.Pro.Carnet.Action.List.AddForm_Tests exposing (AddFormTest, suite)

import Effect exposing (Effect)
import Expect
import Extra.ProgramTest
import Extra.Test
import Extra.Test.Input
import Extra.Test.SearchSelect
import Html.Attributes as Attr
import Pages.Pro.Carnet.Action.List.AddForm as AddForm
import ProgramTest
import Test exposing (..)
import Test.Html.Query as Query
import Test.Html.Selector as Selector exposing (text)
import UI.SearchSelect.Component
import UI.SearchSelect.Fixtures


suite : Test
suite =
    describe "Action creation"
        [ test "shows an alert when submit failed" <|
            \_ ->
                startForm
                    |> fillStartingAt "2023-04-11"
                    |> selectAction "an action"
                    |> submit { willSucceed = False }
                    |> Extra.ProgramTest.expectView [ expectAlertWithText "ajout" ]
        , test "hides the submit error on next submit" <|
            \_ ->
                startForm
                    |> fillStartingAt "2023-04-11"
                    |> selectAction "an action"
                    |> submit { willSucceed = True }
                    |> Extra.ProgramTest.expectView [ expectNoAlert ]
        , describe "Add button"
            [ test "is disabled when the date is missing" <|
                \_ ->
                    startForm
                        |> fillStartingAt ""
                        |> selectAction "an action"
                        |> Extra.ProgramTest.expectView
                            [ expectSubmitButton { disabled = True } ]
            , test "is disabled when the date is invalid" <|
                \_ ->
                    startForm
                        |> fillStartingAt "hihi"
                        |> selectAction "an action"
                        |> Extra.ProgramTest.expectView
                            [ expectSubmitButton { disabled = True } ]
            , test "is disabled when no action is selected" <|
                \_ ->
                    startForm
                        |> fillStartingAt "2023-04-11"
                        |> selectAction "an action"
                        |> resetAction
                        |> Extra.ProgramTest.expectView
                            [ expectSubmitButton { disabled = True } ]
            , test "is enabled when the form is valid" <|
                \_ ->
                    startForm
                        |> fillStartingAt "2023-04-11"
                        |> selectAction "an action"
                        |> Extra.ProgramTest.expectView
                            [ expectSubmitButton { disabled = False } ]
            , test "resets the form" <|
                \_ ->
                    startForm
                        |> fillStartingAt "2023-04-11"
                        |> selectAction "an action"
                        |> submit { willSucceed = True }
                        |> Extra.ProgramTest.expectView
                            [ expectStartingDateToBe ""
                            , expectActionToBe "Sélectionner une action"
                            ]
            , test "does not reset the form when submit failed" <|
                \_ ->
                    startForm
                        |> fillStartingAt "2023-04-11"
                        |> selectAction "an action"
                        |> submit { willSucceed = False }
                        |> Extra.ProgramTest.expectView
                            [ expectStartingDateToBe "2023-04-11"
                            , expectActionToBe "an action"
                            ]
            ]
        ]


resetAction : AddFormTest -> AddFormTest
resetAction =
    ProgramTest.update (AddForm.ActionMsg UI.SearchSelect.Component.Reset)


expectAlertWithText : String -> Query.Single AddForm.Msg -> Expect.Expectation
expectAlertWithText alertText =
    Query.find [ Selector.attribute <| Attr.attribute "role" "alert" ]
        >> Query.has [ text alertText ]


expectNoAlert : Query.Single AddForm.Msg -> Expect.Expectation
expectNoAlert =
    Query.hasNot [ Selector.attribute <| Attr.attribute "role" "alert" ]


expectSubmitButton : { disabled : Bool } -> Query.Single AddForm.Msg -> Expect.Expectation
expectSubmitButton { disabled } =
    Extra.Test.findButtonByText "Ajouter"
        >> Query.has [ Selector.disabled disabled ]


expectActionToBe : String -> Query.Single AddForm.Msg -> Expect.Expectation
expectActionToBe action =
    Extra.Test.SearchSelect.expectSearchSelectHas
        { label = "Actions"
        , value = action
        }


expectStartingDateToBe : String -> Query.Single AddForm.Msg -> Expect.Expectation
expectStartingDateToBe date =
    Extra.Test.Input.expectInputHas
        { label = "Date de début"
        , value = date
        }


submit : { willSucceed : Bool } -> AddFormTest -> AddFormTest
submit { willSucceed } =
    ProgramTest.clickButton "Ajouter"
        >> ProgramTest.update (AddForm.HasSubmitSucceeded willSucceed)


type alias AddFormTest =
    ProgramTest.ProgramTest AddForm.Model AddForm.Msg (Effect AddForm.Msg)


selectAction : String -> AddFormTest -> AddFormTest
selectAction action =
    Extra.Test.SearchSelect.selectOption
        { label = "Actions"
        , option = action
        , toProgramMsg = AddForm.ActionMsg
        }


fillStartingAt : String -> AddFormTest -> AddFormTest
fillStartingAt date =
    Extra.Test.Input.fillIn { label = "Date de début", value = date }


startForm : AddFormTest
startForm =
    ProgramTest.createElement
        { init = AddForm.init
        , update = AddForm.update
        , view = AddForm.view
        }
        |> ProgramTest.start
            { targetId = "targetId"
            , actionSearchApi = UI.SearchSelect.Fixtures.fakeSearchApi
            }
