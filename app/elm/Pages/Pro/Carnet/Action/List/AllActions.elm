module Pages.Pro.Carnet.Action.List.AllActions exposing (Action, Creator, fetchAllByTargetId, sortByStatus)

import Extra.GraphQL
import GraphQL.Enum.Action_status_enum
import Pages.Pro.Carnet.Action.List.GetActionsByTargetId
import Time


type alias Action =
    { id : String
    , description : String
    , status : GraphQL.Enum.Action_status_enum.Action_status_enum
    , startingAt : Time.Posix
    , creator : Creator
    }


type alias Creator =
    { firstName : String, lastName : String }


fetchAllByTargetId : { id : String, responseMsg : Result String (List Action) -> msg } -> Cmd msg
fetchAllByTargetId { id, responseMsg } =
    Extra.GraphQL.postOperation
        (Pages.Pro.Carnet.Action.List.GetActionsByTargetId.query { targetId = id })
        (Result.map
            (.target
                >> Maybe.map .actions
                >> Maybe.withDefault []
                >> List.map
                    (\action ->
                        { id = action.id
                        , description = action.action
                        , status = action.status
                        , startingAt =
                            action.startingAt
                        , creator =
                            case ( action.creator.orientation_manager, action.creator.professional ) of
                                ( Just om, _ ) ->
                                    { firstName = Maybe.withDefault "" om.firstname
                                    , lastName = Maybe.withDefault "" om.lastname
                                    }

                                ( _, Just pro ) ->
                                    { firstName = pro.firstname
                                    , lastName = pro.lastname
                                    }

                                _ ->
                                    { firstName = ""
                                    , lastName = ""
                                    }
                        }
                    )
                >> sortByStatus
            )
            >> Result.mapError (always "graphql error!")
            >> responseMsg
        )


sortByStatus : List Action -> List Action
sortByStatus =
    List.sortBy
        (\action ->
            case action.status of
                GraphQL.Enum.Action_status_enum.In_progress ->
                    1

                _ ->
                    2
        )
