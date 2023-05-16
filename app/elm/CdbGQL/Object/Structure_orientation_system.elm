-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Object.Structure_orientation_system exposing (..)

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


createdAt : SelectionSet CdbGQL.ScalarCodecs.Timestamptz CdbGQL.Object.Structure_orientation_system
createdAt =
    Object.selectionForField "ScalarCodecs.Timestamptz" "createdAt" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecTimestamptz |> .decoder)


id : SelectionSet CdbGQL.ScalarCodecs.Uuid CdbGQL.Object.Structure_orientation_system
id =
    Object.selectionForField "ScalarCodecs.Uuid" "id" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecUuid |> .decoder)


{-| An object relationship
-}
orientationSystem :
    SelectionSet decodesTo CdbGQL.Object.Orientation_system
    -> SelectionSet decodesTo CdbGQL.Object.Structure_orientation_system
orientationSystem object____ =
    Object.selectionForCompositeField "orientationSystem" [] object____ Basics.identity


orientationSystemId : SelectionSet CdbGQL.ScalarCodecs.Uuid CdbGQL.Object.Structure_orientation_system
orientationSystemId =
    Object.selectionForField "ScalarCodecs.Uuid" "orientationSystemId" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecUuid |> .decoder)


{-| An object relationship
-}
structure :
    SelectionSet decodesTo CdbGQL.Object.Structure
    -> SelectionSet decodesTo CdbGQL.Object.Structure_orientation_system
structure object____ =
    Object.selectionForCompositeField "structure" [] object____ Basics.identity


structureId : SelectionSet CdbGQL.ScalarCodecs.Uuid CdbGQL.Object.Structure_orientation_system
structureId =
    Object.selectionForField "ScalarCodecs.Uuid" "structureId" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecUuid |> .decoder)