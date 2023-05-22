-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Object.Account_aggregate exposing (..)

import CdbGQL.InputObject
import CdbGQL.Interface
import CdbGQL.Object
import CdbGQL.Scalar
import CdbGQL.ScalarCodecs
import CdbGQL.Union
import Graphql.Internal.Builder.Argument as Argument exposing (Argument)
import Graphql.Internal.Builder.Object as Object
import Graphql.Internal.Encode as Encode exposing (Value)
import Graphql.Operation exposing (RootMutation, RootQuery, RootSubscription)
import Graphql.OptionalArgument exposing (OptionalArgument(..))
import Graphql.SelectionSet exposing (SelectionSet)
import Json.Decode as Decode


aggregate :
    SelectionSet decodesTo CdbGQL.Object.Account_aggregate_fields
    -> SelectionSet (Maybe decodesTo) CdbGQL.Object.Account_aggregate
aggregate object____ =
    Object.selectionForCompositeField "aggregate" [] object____ (Basics.identity >> Decode.nullable)


nodes :
    SelectionSet decodesTo CdbGQL.Object.Account
    -> SelectionSet (List decodesTo) CdbGQL.Object.Account_aggregate
nodes object____ =
    Object.selectionForCompositeField "nodes" [] object____ (Basics.identity >> Decode.list)
