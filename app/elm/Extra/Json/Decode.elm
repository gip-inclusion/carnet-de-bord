module Extra.Json.Decode exposing (mapOrFail)

import Json.Decode as Decode


mapOrFail : (a -> Result String b) -> Decode.Decoder a -> Decode.Decoder b
mapOrFail f decoder =
    decoder
        |> Decode.andThen
            (\a ->
                case f a of
                    Ok b ->
                        Decode.succeed b

                    Err message ->
                        Decode.fail message
            )
