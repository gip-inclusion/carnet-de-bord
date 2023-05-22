-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Object.Nps_rating_min_fields exposing (..)

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


accountId : SelectionSet (Maybe CdbGQL.ScalarCodecs.Uuid) CdbGQL.Object.Nps_rating_min_fields
accountId =
    Object.selectionForField "(Maybe ScalarCodecs.Uuid)" "accountId" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecUuid |> .decoder |> Decode.nullable)


createdAt : SelectionSet (Maybe CdbGQL.ScalarCodecs.Timestamptz) CdbGQL.Object.Nps_rating_min_fields
createdAt =
    Object.selectionForField "(Maybe ScalarCodecs.Timestamptz)" "createdAt" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecTimestamptz |> .decoder |> Decode.nullable)


id : SelectionSet (Maybe CdbGQL.ScalarCodecs.Uuid) CdbGQL.Object.Nps_rating_min_fields
id =
    Object.selectionForField "(Maybe ScalarCodecs.Uuid)" "id" [] (CdbGQL.ScalarCodecs.codecs |> CdbGQL.Scalar.unwrapCodecs |> .codecUuid |> .decoder |> Decode.nullable)


score : SelectionSet (Maybe Int) CdbGQL.Object.Nps_rating_min_fields
score =
    Object.selectionForField "(Maybe Int)" "score" [] (Decode.int |> Decode.nullable)
