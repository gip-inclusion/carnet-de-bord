module Extra.Date exposing (decoder, print)

import Date exposing (Date)
import Extra.Json.Decode
import Json.Decode as Decode


print : Date -> String
print date =
    Date.format "dd/MM/YYYY" date


decoder : Decode.Decoder Date
decoder =
    Decode.string
        |> Extra.Json.Decode.mapOrFail (String.split "T" >> List.head >> Result.fromMaybe "Expected an ISO date time")
        |> Extra.Json.Decode.mapOrFail Date.fromIsoString
