module Pages.Pro.Carnet.Action.List.AllActions exposing (Action, Creator, fetchAllByTargetId)

import CdbGQL.Enum.Action_status_enum as ActionStatus
import CdbGQL.Enum.Order_by exposing (Order_by(..))
import CdbGQL.InputObject
import CdbGQL.Object
import CdbGQL.Object.Account as GQLAccount
import CdbGQL.Object.Notebook_action as GQLAction
import CdbGQL.Object.Notebook_target as GQLTarget exposing (ActionsOptionalArguments)
import CdbGQL.Object.Orientation_manager as GQL_OM
import CdbGQL.Object.Professional as GQLProfessional
import CdbGQL.Query
import CdbGQL.Scalar
import Date
import DebugView.Graphql
import Extra.Date
import Extra.GraphQL
import Graphql.Http
import Graphql.Operation
import Graphql.OptionalArgument as OptionalArgument
import Graphql.SelectionSet as Selection exposing (SelectionSet)
import Select exposing (Action)


type alias Action =
    { id : CdbGQL.Scalar.Uuid
    , description : String
    , status : ActionStatus.Action_status_enum
    , startingAt : Date.Date
    , creator : Creator
    }


type alias Creator =
    { firstName : String, lastName : String }



-- GraphQL


fetchAllByTargetId : { id : String, responseMsg : Result String (List Action) -> msg } -> Cmd msg
fetchAllByTargetId { id, responseMsg } =
    actionsByTargetIdSelector id
        |> Graphql.Http.queryRequest "/graphql"
        |> Graphql.Http.send
            (Result.mapError DebugView.Graphql.graphqlErrorToString
                >> responseMsg
            )


actionsByTargetIdSelector : String -> SelectionSet (List Action) Graphql.Operation.RootQuery
actionsByTargetIdSelector id =
    CdbGQL.Query.notebook_target_by_pk
        { id = CdbGQL.Scalar.Uuid id }
        (GQLTarget.actions sortByStartingAt actionSelector)
        |> Selection.nonNullOrFail
        |> Selection.map sortByStatus


sortByStartingAt : ActionsOptionalArguments -> ActionsOptionalArguments
sortByStartingAt params =
    { params
        | order_by =
            OptionalArgument.Present
                [ CdbGQL.InputObject.buildNotebook_action_order_by
                    (\fields -> { fields | startingAt = OptionalArgument.Present Desc })
                ]
    }


actionSelector : SelectionSet Action CdbGQL.Object.Notebook_action
actionSelector =
    Selection.succeed Action
        |> Selection.with GQLAction.id
        |> Selection.with GQLAction.action
        |> Selection.with GQLAction.status
        |> Selection.with (GQLAction.startingAt |> Selection.mapOrFail timestampzToDate)
        |> Selection.with (GQLAction.creator creatorSelector)


timestampzToDate : CdbGQL.Scalar.Timestamptz -> Result String Date.Date
timestampzToDate (CdbGQL.Scalar.Timestamptz raw) =
    Extra.Date.parseTimestamp raw


creatorSelector : SelectionSet Creator CdbGQL.Object.Account
creatorSelector =
    Extra.GraphQL.oneOf
        [ GQLAccount.orientation_manager orientationManagerSelector
        , GQLAccount.professional professionalSelector
        ]


professionalSelector : SelectionSet Creator CdbGQL.Object.Professional
professionalSelector =
    Selection.succeed Creator
        |> Selection.with GQLProfessional.firstname
        |> Selection.with GQLProfessional.lastname


orientationManagerSelector : SelectionSet Creator CdbGQL.Object.Orientation_manager
orientationManagerSelector =
    Selection.succeed Creator
        |> Selection.with (GQL_OM.firstname |> Selection.nonNullOrFail)
        |> Selection.with (GQL_OM.lastname |> Selection.nonNullOrFail)


sortByStatus : List Action -> List Action
sortByStatus =
    List.sortBy
        (\action ->
            case action.status of
                ActionStatus.In_progress ->
                    1

                _ ->
                    2
        )
