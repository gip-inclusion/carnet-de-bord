module ReadOnlyNotebook.Main exposing (..)

import Browser
import Html exposing (Html, div, h1, text)
import Http
import Json.Decode
import Json.Encode


type alias Token =
    String


type alias Flags =
    { token : Token
    , serverUrl : String
    , notebookId : String
    }


type alias Model =
    { token : Token
    , serverUrl : String
    , notebookId : String
    , notebook : NotebookLoadingState
    }


type NotebookLoadingState
    = Loaded Data
    | Loading
    | LoadingError


type Msg
    = NotebookResult (Result Http.Error Data)


type alias Data =
    { data : NotebookData
    }


type alias NotebookData =
    { notebook : Notebook
    }


type alias Notebook =
    { beneficiary : Beneficiary
    , members : List NotebookMember
    }


type alias Beneficiary =
    { id : String
    , firstname : String
    , lastname : String
    , dateOfBirth : String
    , mobileNumber : Maybe String
    , email : Maybe String
    , address1 : Maybe String
    , address2 : Maybe String
    , postalCode : Maybe String
    , city : Maybe String
    , cafNumber : Maybe String
    , peNumber : Maybe String
    }


type alias Structure =
    { name : String
    }


type alias OrientationManagerData =
    { firstname : String
    , lastname : String
    }


type alias ProData =
    { firstname : String
    , lastname : String
    , position : String
    , structure : Structure
    }


type Account
    = Pro ProData
    | OrientationManager OrientationManagerData


type alias NotebookMember =
    { memberType : String
    , account : Maybe Account
    }


type alias NotebookVariables =
    { id : String
    }


type alias GqlQuery =
    { query : String
    , variables : NotebookVariables
    }


beneficiaryDecoder : Json.Decode.Decoder Beneficiary
beneficiaryDecoder =
    let
        fieldSet0 =
            Json.Decode.map6 Beneficiary
                (Json.Decode.field "id" Json.Decode.string)
                (Json.Decode.field "firstname" Json.Decode.string)
                (Json.Decode.field "lastname" Json.Decode.string)
                (Json.Decode.field "dateOfBirth" Json.Decode.string)
                (Json.Decode.field "mobileNumber" <| Json.Decode.nullable Json.Decode.string)
                (Json.Decode.field "email" <| Json.Decode.nullable Json.Decode.string)

        fieldSet1 =
            Json.Decode.map6 (<|)
                fieldSet0
                (Json.Decode.field "address1" <| Json.Decode.nullable Json.Decode.string)
                (Json.Decode.field "address2" <| Json.Decode.nullable Json.Decode.string)
                (Json.Decode.field "city" <| Json.Decode.nullable Json.Decode.string)
                (Json.Decode.field "postalCode" <| Json.Decode.nullable Json.Decode.string)
                (Json.Decode.field "cafNumber" <| Json.Decode.nullable Json.Decode.string)
    in
    Json.Decode.map2 (<|)
        fieldSet1
        (Json.Decode.field "peNumber" <| Json.Decode.nullable Json.Decode.string)


accountDecoder : Json.Decode.Decoder Account
accountDecoder =
    Json.Decode.field "type" Json.Decode.string
        |> Json.Decode.andThen
            (\type_ ->
                case type_ of
                    "professional" ->
                        Json.Decode.field "professional" proDecoder

                    "orientation_manager" ->
                        Json.Decode.field "orientation_manager" orientationManagerDecoder

                    _ ->
                        Json.Decode.fail <| "Elm Json decoding failed: unknown type " ++ type_
            )


proDecoder : Json.Decode.Decoder Account
proDecoder =
    Json.Decode.map Pro <|
        Json.Decode.map4 ProData
            (Json.Decode.field "firstname" Json.Decode.string)
            (Json.Decode.field "lastname" Json.Decode.string)
            (Json.Decode.field "position" Json.Decode.string)
            (Json.Decode.map Structure <| Json.Decode.at [ "structure", "name" ] Json.Decode.string)


orientationManagerDecoder : Json.Decode.Decoder Account
orientationManagerDecoder =
    Json.Decode.map OrientationManager <|
        Json.Decode.map2 OrientationManagerData
            (Json.Decode.field "firstname" Json.Decode.string)
            (Json.Decode.field "lastname" Json.Decode.string)


notebookMemberDecoder : Json.Decode.Decoder NotebookMember
notebookMemberDecoder =
    Json.Decode.map2 NotebookMember
        (Json.Decode.field "memberType" Json.Decode.string)
        (Json.Decode.field "account" <| Json.Decode.nullable accountDecoder)


dataDecoder : Json.Decode.Decoder Data
dataDecoder =
    Json.Decode.map Data (Json.Decode.field "data" notebookDataDecoder)


notebookDataDecoder : Json.Decode.Decoder NotebookData
notebookDataDecoder =
    Json.Decode.map NotebookData (Json.Decode.field "notebook" notebookDecoder)


notebookDecoder : Json.Decode.Decoder Notebook
notebookDecoder =
    Json.Decode.map2 Notebook
        (Json.Decode.field "beneficiary" beneficiaryDecoder)
        (Json.Decode.field "members" <| Json.Decode.list notebookMemberDecoder)


encodeGqlQuery : GqlQuery -> Json.Encode.Value
encodeGqlQuery record =
    Json.Encode.object
        [ ( "query", Json.Encode.string <| record.query )
        , ( "variables", encodeGqlQueryVariables <| record.variables )
        ]


encodeGqlQueryVariables : NotebookVariables -> Json.Encode.Value
encodeGqlQueryVariables record =
    Json.Encode.object
        [ ( "id", Json.Encode.string <| record.id )
        ]


getNotebook : Token -> String -> String -> (Result Http.Error Data -> msg) -> Cmd msg
getNotebook token serverUrl notebookId toMsg =
    let
        gqlQuery =
            { query = """
query GetNotebookInfo($id: uuid!) {
  notebook:notebook_by_pk(id: $id) {
    members {
      memberType
      account {
        type
        professional {
          firstname
          lastname
          position
          structure {
            name
          }
        }
        orientation_manager {
          firstname
          lastname
        }
      }
    }
    beneficiary {
      id
      firstname
      lastname
      dateOfBirth
      postalCode
      city
      address1
      address2
      mobileNumber
      email
      peNumber
      cafNumber
    }
  }
}
      """
            , variables = { id = notebookId }
            }
    in
    Http.request
        { method = "POST"
        , headers = [ Http.header "authorization" ("Bearer " ++ token) ]
        , url = serverUrl
        , body = Http.jsonBody (encodeGqlQuery gqlQuery)
        , expect = Http.expectJson toMsg dataDecoder
        , timeout = Nothing
        , tracker = Nothing
        }


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        model =
            { token = flags.token
            , serverUrl = flags.serverUrl
            , notebookId = flags.notebookId
            , notebook = Loading
            }
    in
    ( model
    , getNotebook model.token
        model.serverUrl
        model.notebookId
        NotebookResult
    )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NotebookResult result ->
            case result of
                Ok notebook ->
                    ( { model | notebook = Loaded notebook }, Cmd.none )

                Err e ->
                    let
                        _ =
                            Debug.log "ERR" e
                    in
                    ( { model | notebook = LoadingError }, Cmd.none )


view : Model -> Html Msg
view model =
    case model.notebook of
        Loaded root ->
            h1 [] [ text <| root.data.notebook.beneficiary.firstname ++ " " ++ root.data.notebook.beneficiary.lastname ]

        _ ->
            text ""
