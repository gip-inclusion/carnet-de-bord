module Pages.Pro.Carnet.Action.List.AllActions_Tests exposing (suite)

import CdbGQL.Enum.Action_status_enum exposing (Action_status_enum(..))
import CdbGQL.Scalar
import Expect
import Extra.CdbGQL
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
                [ { anAction | status = In_progress }
                , { anAction | status = Abandonned }
                , { anAction | status = In_progress }
                , { anAction | status = Done }
                ]
                    |> AllActions.sortByStatus
                    |> List.map .status
                    |> Expect.equalLists [ In_progress, In_progress, Abandonned, Done ]
        , test "the existing order is preserved for in progress" <|
            \_ ->
                let
                    anAction =
                        Fixtures.action1
                in
                [ { anAction | id = CdbGQL.Scalar.Uuid "1", status = In_progress }
                , { anAction | id = CdbGQL.Scalar.Uuid "2", status = Done }
                , { anAction | id = CdbGQL.Scalar.Uuid "3", status = In_progress }
                , { anAction | id = CdbGQL.Scalar.Uuid "4", status = In_progress }
                ]
                    |> AllActions.sortByStatus
                    |> List.map (.id >> Extra.CdbGQL.printUuid)
                    |> Expect.equalLists [ "1", "3", "4", "2" ]
        , test "the existing order is preserved between other statuses" <|
            \_ ->
                let
                    anAction =
                        Fixtures.action1
                in
                [ { anAction | id = CdbGQL.Scalar.Uuid "1", status = Done }
                , { anAction | id = CdbGQL.Scalar.Uuid "2", status = In_progress }
                , { anAction | id = CdbGQL.Scalar.Uuid "3", status = Abandonned }
                , { anAction | id = CdbGQL.Scalar.Uuid "4", status = Done }
                , { anAction | id = CdbGQL.Scalar.Uuid "5", status = In_progress }
                ]
                    |> AllActions.sortByStatus
                    |> List.map (.id >> Extra.CdbGQL.printUuid)
                    |> Expect.equalLists [ "2", "5", "1", "3", "4" ]
        ]
