module Pages.Pro.Carnet.Action.List.AllActions_Tests exposing (suite)

import Expect
import GraphQL.Enum.Action_status_enum
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
                [ { anAction | status = GraphQL.Enum.Action_status_enum.In_progress }
                , { anAction | status = GraphQL.Enum.Action_status_enum.Abandonned }
                , { anAction | status = GraphQL.Enum.Action_status_enum.In_progress }
                , { anAction | status = GraphQL.Enum.Action_status_enum.Done }
                ]
                    |> AllActions.sortByStatus
                    |> List.map .status
                    |> Expect.equalLists [ GraphQL.Enum.Action_status_enum.In_progress, GraphQL.Enum.Action_status_enum.In_progress, GraphQL.Enum.Action_status_enum.Abandonned, GraphQL.Enum.Action_status_enum.Done ]
        , test "the existing order is preserved for in progress" <|
            \_ ->
                let
                    anAction =
                        Fixtures.action1
                in
                [ { anAction | id = "1", status = GraphQL.Enum.Action_status_enum.In_progress }
                , { anAction | id = "2", status = GraphQL.Enum.Action_status_enum.Done }
                , { anAction | id = "3", status = GraphQL.Enum.Action_status_enum.In_progress }
                , { anAction | id = "4", status = GraphQL.Enum.Action_status_enum.In_progress }
                ]
                    |> AllActions.sortByStatus
                    |> List.map .id
                    |> Expect.equalLists [ "1", "3", "4", "2" ]
        , test "the existing order is preserved between other statuses" <|
            \_ ->
                let
                    anAction =
                        Fixtures.action1
                in
                [ { anAction | id = "1", status = GraphQL.Enum.Action_status_enum.Done }
                , { anAction | id = "2", status = GraphQL.Enum.Action_status_enum.In_progress }
                , { anAction | id = "3", status = GraphQL.Enum.Action_status_enum.Abandonned }
                , { anAction | id = "4", status = GraphQL.Enum.Action_status_enum.Done }
                , { anAction | id = "5", status = GraphQL.Enum.Action_status_enum.In_progress }
                ]
                    |> AllActions.sortByStatus
                    |> List.map .id
                    |> Expect.equalLists [ "2", "5", "1", "3", "4" ]
        ]
