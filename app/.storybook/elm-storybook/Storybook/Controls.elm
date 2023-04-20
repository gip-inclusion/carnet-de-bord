module Storybook.Controls exposing
    ( Decoder, none
    , withInt, withEnum
    , decode
    , withString
    )

{-|

@docs Decoder, none
@docs withInt, withEnum
@docs decode

-}

import Dict
import Json.Decode as Decode


type Decoder value
    = Decoder
        { decoder : Decode.Decoder value
        , fallback : value
        }


new : (a -> b) -> Decoder (a -> b)
new fn =
    Decoder
        { decoder = Decode.succeed fn
        , fallback = fn
        }


none : Decoder ()
none =
    Decoder
        { decoder = Decode.succeed ()
        , fallback = ()
        }


with :
    Decoder value
    -> Decoder (value -> output)
    -> Decoder output
with (Decoder field) (Decoder fn) =
    Decoder
        { decoder = Decode.map2 (|>) field.decoder fn.decoder
        , fallback = fn.fallback field.fallback
        }



-- DECODER


decode : Decode.Value -> Decoder value -> value
decode json (Decoder { decoder, fallback }) =
    case Decode.decodeValue decoder json of
        Ok value ->
            value

        Err _ ->
            fallback



-- PRIMITIVES


withString :
    { name : String
    , fallback : String
    }
    -> Decoder (String -> output)
    -> Decoder output
withString options =
    with <|
        Decoder
            { decoder =
                Decode.oneOf
                    [ Decode.field options.name Decode.string
                    , Decode.succeed options.fallback
                    ]
            , fallback = options.fallback
            }


withInt :
    { name : String
    , fallback : Int
    }
    -> Decoder (Int -> output)
    -> Decoder output
withInt options =
    with <|
        Decoder
            { decoder =
                Decode.oneOf
                    [ Decode.field options.name Decode.int
                    , Decode.succeed options.fallback
                    ]
            , fallback = options.fallback
            }


withEnum :
    { name : String
    , options : List ( String, enum )
    , fallback : enum
    }
    -> Decoder (enum -> output)
    -> Decoder output
withEnum options =
    with <|
        Decoder
            { decoder =
                Decode.oneOf
                    [ Decode.field options.name Decode.string
                        |> Decode.andThen
                            (\str ->
                                case Dict.fromList options.options |> Dict.get str of
                                    Just enum ->
                                        Decode.succeed enum

                                    Nothing ->
                                        Decode.fail ""
                            )
                    , Decode.succeed options.fallback
                    ]
            , fallback = options.fallback
            }
