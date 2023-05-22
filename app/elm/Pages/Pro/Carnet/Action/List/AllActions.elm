module Pages.Pro.Carnet.Action.List.AllActions exposing (Action, Creator, fetchAllByTargetId, sort)

import CdbGQL.Object.Account as GQLAccount
import CdbGQL.Object.Notebook_action as GQLAction
import CdbGQL.Object.Notebook_target as GQLTarget
import CdbGQL.Object.Orientation_manager as GQL_OM
import CdbGQL.Object.Professional as GQLProfessional
import CdbGQL.Query
import CdbGQL.Scalar
import Date
import DebugView.Graphql
import Domain.Action.Id exposing (ActionId)
import Domain.Action.Status exposing (ActionStatus(..))
import Graphql.Http
import Graphql.Operation
import Graphql.SelectionSet as Selection exposing (SelectionSet)
import Select exposing (Action)


type alias Action =
    { id : ActionId
    , description : String
    , status : ActionStatus
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
        (GQLTarget.actions identity actionSelector)
        |> Selection.nonNullOrFail
        |> Selection.map sort


actionSelector : SelectionSet Action GQLAction
actionSelector =
    Selection.succeed Action
        |> Selection.with (GQLAction.id |> Selection.map uuidToActionId)
        |> Selection.with GQLAction.action
        |> Selection.with (GQLAction.status |> Selection.mapOrFail Domain.Action.Status.parse)
        |> Selection.with (GQLAction.startingAt |> Selection.mapOrFail timestampzToDate)
        |> Selection.with (GQLAction.creator creatorSelector)


timestampzToDate : CdbGQL.Scalar.Timestamptz -> Result String Date.Date
timestampzToDate (CdbGQL.Scalar.Timestamptz raw) =
    Date.fromIsoString raw


uuidToActionId : CdbGQL.Scalar.Uuid -> ActionId
uuidToActionId (CdbGQL.Scalar.Uuid raw) =
    Domain.Action.Id.ActionId raw


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


sort : List Action -> List Action
sort =
    List.sortBy
        (\action ->
            case action.status of
                InProgress ->
                    1

                _ ->
                    2
        )
