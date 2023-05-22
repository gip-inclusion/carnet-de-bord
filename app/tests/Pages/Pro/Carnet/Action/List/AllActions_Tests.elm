module Pages.Pro.Carnet.Action.List.AllActions_Tests exposing (suite)

import Domain.Action.Id
import Domain.Action.Status exposing (ActionStatus(..))
import Expect
import Pages.Pro.Carnet.Action.List.AllActions as AllActions
import Pages.Pro.Carnet.Action.List.Fixtures as Fixtures
import Test exposing (..)


suite : Test
suite =
    describe "is sorted by status"
        [ test "in progress actions are shown first" <|
            \_ ->
                let
                    anAction =
                        Fixtures.action1
                in
                [ { anAction | status = InProgress }
                , { anAction | status = Abandonned }
                , { anAction | status = InProgress }
                , { anAction | status = Done }
                ]
                    |> AllActions.sort
                    |> List.map .status
                    |> Expect.equalLists [ InProgress, InProgress, Abandonned, Done ]
        , test "the existing order is preserved for in progress" <|
            \_ ->
                let
                    anAction =
                        Fixtures.action1
                in
                [ { anAction | id = Domain.Action.Id.ActionId "1", status = InProgress }
                , { anAction | id = Domain.Action.Id.ActionId "2", status = Done }
                , { anAction | id = Domain.Action.Id.ActionId "3", status = InProgress }
                , { anAction | id = Domain.Action.Id.ActionId "4", status = InProgress }
                ]
                    |> AllActions.sort
                    |> List.map (.id >> Domain.Action.Id.printId)
                    |> Expect.equalLists [ "1", "3", "4", "2" ]
        , test "the existing order is preserved between other statuses" <|
            \_ ->
                let
                    anAction =
                        Fixtures.action1
                in
                [ { anAction | id = Domain.Action.Id.ActionId "1", status = Done }
                , { anAction | id = Domain.Action.Id.ActionId "2", status = InProgress }
                , { anAction | id = Domain.Action.Id.ActionId "3", status = Abandonned }
                , { anAction | id = Domain.Action.Id.ActionId "4", status = Done }
                , { anAction | id = Domain.Action.Id.ActionId "5", status = InProgress }
                ]
                    |> AllActions.sort
                    |> List.map (.id >> Domain.Action.Id.printId)
                    |> Expect.equalLists [ "2", "5", "1", "3", "4" ]
        ]
