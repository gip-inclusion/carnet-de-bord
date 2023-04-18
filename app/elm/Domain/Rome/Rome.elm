module Domain.Rome.Rome exposing (Rome, decoder)

import Json.Decode as Decode


type alias Rome =
    { id : String
    , label : String
    }


decoder : Decode.Decoder Rome
decoder =
    Decode.map2 Rome
        (Decode.field "id" Decode.string)
        (Decode.field "label" Decode.string)
