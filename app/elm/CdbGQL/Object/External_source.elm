-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Object.External_source exposing (..)

import CdbGQL.Enum.External_data_select_column
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


comment : SelectionSet String CdbGQL.Object.External_source
comment =
    Object.selectionForField "String" "comment" [] Decode.string


type alias ExternalDataOptionalArguments =
    { distinct_on : OptionalArgument (List CdbGQL.Enum.External_data_select_column.External_data_select_column)
    , limit : OptionalArgument Int
    , offset : OptionalArgument Int
    , order_by : OptionalArgument (List CdbGQL.InputObject.External_data_order_by)
    , where_ : OptionalArgument CdbGQL.InputObject.External_data_bool_exp
    }


{-| An array relationship

  - distinct\_on - distinct select on columns
  - limit - limit the number of rows returned
  - offset - skip the first n rows. Use only with order\_by
  - order\_by - sort the rows by one or more columns
  - where\_ - filter the rows returned

-}
external_data :
    (ExternalDataOptionalArguments -> ExternalDataOptionalArguments)
    -> SelectionSet decodesTo CdbGQL.Object.External_data
    -> SelectionSet (List decodesTo) CdbGQL.Object.External_source
external_data fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { distinct_on = Absent, limit = Absent, offset = Absent, order_by = Absent, where_ = Absent }

        optionalArgs____ =
            [ Argument.optional "distinct_on" filledInOptionals____.distinct_on (Encode.enum CdbGQL.Enum.External_data_select_column.toString |> Encode.list), Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "order_by" filledInOptionals____.order_by (CdbGQL.InputObject.encodeExternal_data_order_by |> Encode.list), Argument.optional "where" filledInOptionals____.where_ CdbGQL.InputObject.encodeExternal_data_bool_exp ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "external_data" optionalArgs____ object____ (Basics.identity >> Decode.list)


type alias ExternalDataAggregateOptionalArguments =
    { distinct_on : OptionalArgument (List CdbGQL.Enum.External_data_select_column.External_data_select_column)
    , limit : OptionalArgument Int
    , offset : OptionalArgument Int
    , order_by : OptionalArgument (List CdbGQL.InputObject.External_data_order_by)
    , where_ : OptionalArgument CdbGQL.InputObject.External_data_bool_exp
    }


{-| An aggregate relationship

  - distinct\_on - distinct select on columns
  - limit - limit the number of rows returned
  - offset - skip the first n rows. Use only with order\_by
  - order\_by - sort the rows by one or more columns
  - where\_ - filter the rows returned

-}
external_data_aggregate :
    (ExternalDataAggregateOptionalArguments -> ExternalDataAggregateOptionalArguments)
    -> SelectionSet decodesTo CdbGQL.Object.External_data_aggregate
    -> SelectionSet decodesTo CdbGQL.Object.External_source
external_data_aggregate fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { distinct_on = Absent, limit = Absent, offset = Absent, order_by = Absent, where_ = Absent }

        optionalArgs____ =
            [ Argument.optional "distinct_on" filledInOptionals____.distinct_on (Encode.enum CdbGQL.Enum.External_data_select_column.toString |> Encode.list), Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "order_by" filledInOptionals____.order_by (CdbGQL.InputObject.encodeExternal_data_order_by |> Encode.list), Argument.optional "where" filledInOptionals____.where_ CdbGQL.InputObject.encodeExternal_data_bool_exp ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "external_data_aggregate" optionalArgs____ object____ Basics.identity


value : SelectionSet String CdbGQL.Object.External_source
value =
    Object.selectionForField "String" "value" [] Decode.string
