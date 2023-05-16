-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Object.Notebook_info_min_fields exposing (..)

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


createdAt : SelectionSet (Maybe CdbGQL.ScalarCodecs.Timestamptz) CdbGQL.Object.Notebook_info_min_fields
createdAt =
    Object.selectionForField "(Maybe ScalarCodecs.Timestamptz)" "createdAt" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecTimestamptz |> .decoder |> Decode.nullable)


notebookId : SelectionSet (Maybe CdbGQL.ScalarCodecs.Uuid) CdbGQL.Object.Notebook_info_min_fields
notebookId =
    Object.selectionForField "(Maybe ScalarCodecs.Uuid)" "notebookId" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecUuid |> .decoder |> Decode.nullable)


{-| motif de l'orientation, saisi par le chargé d'orientation
-}
orientationReason : SelectionSet (Maybe String) CdbGQL.Object.Notebook_info_min_fields
orientationReason =
    Object.selectionForField "(Maybe String)" "orientationReason" [] (Decode.string |> Decode.nullable)


orientationSystemId : SelectionSet (Maybe CdbGQL.ScalarCodecs.Uuid) CdbGQL.Object.Notebook_info_min_fields
orientationSystemId =
    Object.selectionForField "(Maybe ScalarCodecs.Uuid)" "orientationSystemId" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecUuid |> .decoder |> Decode.nullable)


updatedAt : SelectionSet (Maybe CdbGQL.ScalarCodecs.Timestamptz) CdbGQL.Object.Notebook_info_min_fields
updatedAt =
    Object.selectionForField "(Maybe ScalarCodecs.Timestamptz)" "updatedAt" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecTimestamptz |> .decoder |> Decode.nullable)