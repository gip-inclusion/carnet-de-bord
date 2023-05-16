-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Object.Notebook_event_min_fields exposing (..)

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


creationDate : SelectionSet (Maybe CdbGQL.ScalarCodecs.Timestamptz) CdbGQL.Object.Notebook_event_min_fields
creationDate =
    Object.selectionForField "(Maybe ScalarCodecs.Timestamptz)" "creationDate" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecTimestamptz |> .decoder |> Decode.nullable)


creatorId : SelectionSet (Maybe CdbGQL.ScalarCodecs.Uuid) CdbGQL.Object.Notebook_event_min_fields
creatorId =
    Object.selectionForField "(Maybe ScalarCodecs.Uuid)" "creatorId" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecUuid |> .decoder |> Decode.nullable)


eventDate : SelectionSet (Maybe CdbGQL.ScalarCodecs.Timestamptz) CdbGQL.Object.Notebook_event_min_fields
eventDate =
    Object.selectionForField "(Maybe ScalarCodecs.Timestamptz)" "eventDate" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecTimestamptz |> .decoder |> Decode.nullable)


id : SelectionSet (Maybe CdbGQL.ScalarCodecs.Uuid) CdbGQL.Object.Notebook_event_min_fields
id =
    Object.selectionForField "(Maybe ScalarCodecs.Uuid)" "id" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecUuid |> .decoder |> Decode.nullable)


notebookId : SelectionSet (Maybe CdbGQL.ScalarCodecs.Uuid) CdbGQL.Object.Notebook_event_min_fields
notebookId =
    Object.selectionForField "(Maybe ScalarCodecs.Uuid)" "notebookId" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecUuid |> .decoder |> Decode.nullable)