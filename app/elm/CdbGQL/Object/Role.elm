-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Object.Role exposing (..)

import CdbGQL.Enum.Account_select_column
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


type alias AccountsOptionalArguments =
    { distinct_on : OptionalArgument (List CdbGQL.Enum.Account_select_column.Account_select_column)
    , limit : OptionalArgument Int
    , offset : OptionalArgument Int
    , order_by : OptionalArgument (List CdbGQL.InputObject.Account_order_by)
    , where_ : OptionalArgument CdbGQL.InputObject.Account_bool_exp
    }


{-| An array relationship

  - distinct\_on - distinct select on columns
  - limit - limit the number of rows returned
  - offset - skip the first n rows. Use only with order\_by
  - order\_by - sort the rows by one or more columns
  - where\_ - filter the rows returned

-}
accounts :
    (AccountsOptionalArguments -> AccountsOptionalArguments)
    -> SelectionSet decodesTo CdbGQL.Object.Account
    -> SelectionSet (List decodesTo) CdbGQL.Object.Role
accounts fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { distinct_on = Absent, limit = Absent, offset = Absent, order_by = Absent, where_ = Absent }

        optionalArgs____ =
            [ Argument.optional "distinct_on" filledInOptionals____.distinct_on (Encode.enum CdbGQL.Enum.Account_select_column.toString |> Encode.list), Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "order_by" filledInOptionals____.order_by (CdbGQL.InputObject.encodeAccount_order_by |> Encode.list), Argument.optional "where" filledInOptionals____.where_ CdbGQL.InputObject.encodeAccount_bool_exp ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "accounts" optionalArgs____ object____ (Basics.identity >> Decode.list)


type alias AccountsAggregateOptionalArguments =
    { distinct_on : OptionalArgument (List CdbGQL.Enum.Account_select_column.Account_select_column)
    , limit : OptionalArgument Int
    , offset : OptionalArgument Int
    , order_by : OptionalArgument (List CdbGQL.InputObject.Account_order_by)
    , where_ : OptionalArgument CdbGQL.InputObject.Account_bool_exp
    }


{-| An aggregate relationship

  - distinct\_on - distinct select on columns
  - limit - limit the number of rows returned
  - offset - skip the first n rows. Use only with order\_by
  - order\_by - sort the rows by one or more columns
  - where\_ - filter the rows returned

-}
accounts_aggregate :
    (AccountsAggregateOptionalArguments -> AccountsAggregateOptionalArguments)
    -> SelectionSet decodesTo CdbGQL.Object.Account_aggregate
    -> SelectionSet decodesTo CdbGQL.Object.Role
accounts_aggregate fillInOptionals____ object____ =
    let
        filledInOptionals____ =
            fillInOptionals____ { distinct_on = Absent, limit = Absent, offset = Absent, order_by = Absent, where_ = Absent }

        optionalArgs____ =
            [ Argument.optional "distinct_on" filledInOptionals____.distinct_on (Encode.enum CdbGQL.Enum.Account_select_column.toString |> Encode.list), Argument.optional "limit" filledInOptionals____.limit Encode.int, Argument.optional "offset" filledInOptionals____.offset Encode.int, Argument.optional "order_by" filledInOptionals____.order_by (CdbGQL.InputObject.encodeAccount_order_by |> Encode.list), Argument.optional "where" filledInOptionals____.where_ CdbGQL.InputObject.encodeAccount_bool_exp ]
                |> List.filterMap Basics.identity
    in
    Object.selectionForCompositeField "accounts_aggregate" optionalArgs____ object____ Basics.identity


label : SelectionSet String CdbGQL.Object.Role
label =
    Object.selectionForField "String" "label" [] Decode.string