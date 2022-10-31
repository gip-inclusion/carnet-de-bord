module BeneficiaryApp.Notebook exposing (..)

import Json.Decode
import Json.Encode

type alias Root =
    { data : RootData
    }


type alias RootData =
    { notebook : List RootDataNotebookObject
    }


type alias RootDataNotebookObject =
    { contractEndDate : ()
    , contractSignDate : ()
    , contractStartDate : ()
    , contractType : ()
    , educationLevel : String
    , geographicalArea : String
    , id : String
    , rightAre : Bool
    , rightAss : Bool
    , rightBonus : Bool
    , rightRqth : Bool
    , rightRsa : String
    , workSituation : String
    , workSituationDate : String
    , workSituationEndDate : ()
    }

rootDecoder : Json.Decode.Decoder Root
rootDecoder =
    Json.Decode.map Root
        (Json.Decode.field "data" rootDataDecoder)


rootDataDecoder : Json.Decode.Decoder RootData
rootDataDecoder =
    Json.Decode.map RootData
        (Json.Decode.field "notebook" <| Json.Decode.list rootDataNotebookObjectDecoder)


rootDataNotebookObjectDecoder : Json.Decode.Decoder RootDataNotebookObject
rootDataNotebookObjectDecoder =
    let
        fieldSet0 =
            Json.Decode.map6 RootDataNotebookObject
                (Json.Decode.field "contractEndDate" <| Json.Decode.null ())
                (Json.Decode.field "contractSignDate" <| Json.Decode.null ())
                (Json.Decode.field "contractStartDate" <| Json.Decode.null ())
                (Json.Decode.field "contractType" <| Json.Decode.null ())
                (Json.Decode.field "educationLevel" Json.Decode.string)
                (Json.Decode.field "geographicalArea" Json.Decode.string)

        fieldSet1 =
            Json.Decode.map7 (<|)
                fieldSet0
                (Json.Decode.field "id" Json.Decode.string)
                (Json.Decode.field "rightAre" Json.Decode.bool)
                (Json.Decode.field "rightAss" Json.Decode.bool)
                (Json.Decode.field "rightBonus" Json.Decode.bool)
                (Json.Decode.field "rightRqth" Json.Decode.bool)
                (Json.Decode.field "rightRsa" Json.Decode.string)
    in
    Json.Decode.map4 (<|)
        fieldSet1
        (Json.Decode.field "workSituation" Json.Decode.string)
        (Json.Decode.field "workSituationDate" Json.Decode.string)
        (Json.Decode.field "workSituationEndDate" <| Json.Decode.null ())
