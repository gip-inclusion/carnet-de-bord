-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Object.Orientation_type_mutation_response exposing (..)

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


{-| number of rows affected by the mutation
-}
affected_rows : SelectionSet Int CdbGQL.Object.Orientation_type_mutation_response
affected_rows =
    Object.selectionForField "Int" "affected_rows" [] Decode.int


{-| data from the rows affected by the mutation
-}
returning :
    SelectionSet decodesTo CdbGQL.Object.Orientation_type
    -> SelectionSet (List decodesTo) CdbGQL.Object.Orientation_type_mutation_response
returning object____ =
    Object.selectionForCompositeField "returning" [] object____ (Basics.identity >> Decode.list)
