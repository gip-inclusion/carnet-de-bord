-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module CdbGQL.Scalar exposing (Citext(..), Codecs, Date(..), Float8(..), Jsonb(..), Timestamp(..), Timestamptz(..), Uuid(..), defaultCodecs, defineCodecs, unwrapCodecs, unwrapEncoder)

import Graphql.Codec exposing (Codec)
import Graphql.Internal.Builder.Object as Object
import Graphql.Internal.Encode
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode


type Citext
    = Citext String


type Date
    = Date String


type Float8
    = Float8 String


type Jsonb
    = Jsonb String


type Timestamp
    = Timestamp String


type Timestamptz
    = Timestamptz String


type Uuid
    = Uuid String


defineCodecs :
    { codecCitext : Codec valueCitext
    , codecDate : Codec valueDate
    , codecFloat8 : Codec valueFloat8
    , codecJsonb : Codec valueJsonb
    , codecTimestamp : Codec valueTimestamp
    , codecTimestamptz : Codec valueTimestamptz
    , codecUuid : Codec valueUuid
    }
    -> Codecs valueCitext valueDate valueFloat8 valueJsonb valueTimestamp valueTimestamptz valueUuid
defineCodecs definitions =
    Codecs definitions


unwrapCodecs :
    Codecs valueCitext valueDate valueFloat8 valueJsonb valueTimestamp valueTimestamptz valueUuid
    ->
        { codecCitext : Codec valueCitext
        , codecDate : Codec valueDate
        , codecFloat8 : Codec valueFloat8
        , codecJsonb : Codec valueJsonb
        , codecTimestamp : Codec valueTimestamp
        , codecTimestamptz : Codec valueTimestamptz
        , codecUuid : Codec valueUuid
        }
unwrapCodecs (Codecs unwrappedCodecs) =
    unwrappedCodecs


unwrapEncoder :
    (RawCodecs valueCitext valueDate valueFloat8 valueJsonb valueTimestamp valueTimestamptz valueUuid -> Codec getterValue)
    -> Codecs valueCitext valueDate valueFloat8 valueJsonb valueTimestamp valueTimestamptz valueUuid
    -> getterValue
    -> Graphql.Internal.Encode.Value
unwrapEncoder getter (Codecs unwrappedCodecs) =
    (unwrappedCodecs |> getter |> .encoder) >> Graphql.Internal.Encode.fromJson


type Codecs valueCitext valueDate valueFloat8 valueJsonb valueTimestamp valueTimestamptz valueUuid
    = Codecs (RawCodecs valueCitext valueDate valueFloat8 valueJsonb valueTimestamp valueTimestamptz valueUuid)


type alias RawCodecs valueCitext valueDate valueFloat8 valueJsonb valueTimestamp valueTimestamptz valueUuid =
    { codecCitext : Codec valueCitext
    , codecDate : Codec valueDate
    , codecFloat8 : Codec valueFloat8
    , codecJsonb : Codec valueJsonb
    , codecTimestamp : Codec valueTimestamp
    , codecTimestamptz : Codec valueTimestamptz
    , codecUuid : Codec valueUuid
    }


defaultCodecs : RawCodecs Citext Date Float8 Jsonb Timestamp Timestamptz Uuid
defaultCodecs =
    { codecCitext =
        { encoder = \(Citext raw) -> Encode.string raw
        , decoder = Object.scalarDecoder |> Decode.map Citext
        }
    , codecDate =
        { encoder = \(Date raw) -> Encode.string raw
        , decoder = Object.scalarDecoder |> Decode.map Date
        }
    , codecFloat8 =
        { encoder = \(Float8 raw) -> Encode.string raw
        , decoder = Object.scalarDecoder |> Decode.map Float8
        }
    , codecJsonb =
        { encoder = \(Jsonb raw) -> Encode.string raw
        , decoder = Object.scalarDecoder |> Decode.map Jsonb
        }
    , codecTimestamp =
        { encoder = \(Timestamp raw) -> Encode.string raw
        , decoder = Object.scalarDecoder |> Decode.map Timestamp
        }
    , codecTimestamptz =
        { encoder = \(Timestamptz raw) -> Encode.string raw
        , decoder = Object.scalarDecoder |> Decode.map Timestamptz
        }
    , codecUuid =
        { encoder = \(Uuid raw) -> Encode.string raw
        , decoder = Object.scalarDecoder |> Decode.map Uuid
        }
    }