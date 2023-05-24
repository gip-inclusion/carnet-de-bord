module Extra.GraphQL exposing (oneOf)

import Graphql.SelectionSet


oneOf : List (Graphql.SelectionSet.SelectionSet (Maybe a) scope) -> Graphql.SelectionSet.SelectionSet a scope
oneOf selectors =
    selectors
        |> Graphql.SelectionSet.list
        |> Graphql.SelectionSet.mapOrFail
            (getFirstNonNull
                >> Result.fromMaybe "Expecting one of the selectors to provide a non null value"
            )


getFirstNonNull : List (Maybe a) -> Maybe a
getFirstNonNull =
    List.filterMap identity >> List.head
