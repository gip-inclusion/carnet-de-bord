module ReadOnlyNotebook.Main exposing (..)

import Browser
import Html exposing (Html, a, div, h2, h3, p, text)
import Html.Attributes exposing (class, href, title)
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
    = Loaded Notebook
    | Loading
    | LoadingError


type Msg
    = NotebookResult (Result Http.Error Notebook)


type alias Notebook =
    { beneficiary : Beneficiary
    , members : List NotebookMember
    }


type alias Beneficiary =
    { id : String
    , firstname : String
    , lastname : String
    , mobileNumber : String
    , email : String
    , dateOfBirth : String
    , address1 : String
    , address2 : String
    , city : String
    , postalCode : String
    , cafNumber : String
    , peNumber : String
    }


type alias Structure =
    { name : String
    }


type Account
    = Pro
        { firstname : String
        , lastname : String
        , position : String
        , structure : Structure
        }
    | OrientationManager
        { firstname : String
        , lastname : String
        }


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


notebookDecoder : Json.Decode.Decoder Notebook
notebookDecoder =
    let
        unOrientedBeneficiaryParser =
            Json.Decode.field "data"
                (Json.Decode.field "unorientedBeneficiaryCount"
                    (Json.Decode.field "aggregate"
                        (Json.Decode.field "count" Json.Decode.int)
                    )
                )

        orientedBeneficiaryParser =
            Json.Decode.field "data"
                (Json.Decode.field "orientedBeneficiaryCount"
                    (Json.Decode.field "aggregate"
                        (Json.Decode.field "count" Json.Decode.int)
                    )
                )
    in
    Json.Decode.map2 Notebook
        orientedBeneficiaryParser
        unOrientedBeneficiaryParser


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


getNotebook : Token -> String -> String -> (Result Http.Error Notebook -> msg) -> Cmd msg
getNotebook token serverUrl notebookId toMsg =
    let
        gqlQuery =
            { query = """
query GetBeneficiaryDashboard($id: uuid!) {
  unorientedBeneficiaryCount: beneficiary_aggregate(where: {
    notebook: {
      members: {accountId: {_eq: $id}},
      notebookInfo: {needOrientation: {_eq: true}}
    }}) {
    aggregate {
      count
    }
  }
  orientedBeneficiaryCount: beneficiary_aggregate(where: {
    notebook: {
      members: {accountId: {_eq: $id}},
      _not: {notebookInfo: {needOrientation: {_eq: true}}}
    }}) {
    aggregate {
      count
    }
  }
  orientationRequestCount: beneficiary_aggregate( where: {
    notebook: { members: {accountId: {_eq: $id}} },
    orientationRequest: { decidedAt: { _is_null: true } }
    }) {
    aggregate {
      count
    }
  }
  otherUnorientedBeneficiaryCount: beneficiary_aggregate(where: {
    notebook: {
      _and: [
        {notebookInfo: {needOrientation: {_eq: true}}},
        {_not: {members: {accountId: {_eq: $id}}}}
      ]
    }}) {
    aggregate {
      count
    }
  }
  otherOrientedBeneficiaryCount: beneficiary_aggregate(where: {
    notebook: {
      _and: [
        {_not: {notebookInfo: {needOrientation: {_eq: true}}}},
        {_not: {members: {accountId: {_eq: $id}}}}
      ]
    }}) {
    aggregate {
      count
    }
  }
  otherOrientationRequestCount: beneficiary_aggregate( where: {
      notebook: { _not: { members: { accountId: { _eq: $id } } } }
      orientationRequest: { decidedAt: { _is_null: true } }
    }) {
    aggregate {
      count
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
        , expect = Http.expectJson toMsg notebookDecoder
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

                Err _ ->
                    ( { model | notebook = LoadingError }, Cmd.none )


view : Model -> Html Msg
view model =
    text "coucou"
