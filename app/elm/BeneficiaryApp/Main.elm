port module BeneficiaryApp.Main exposing (..)

import BeneficiaryApp.GqlJson exposing (GqlQuery, GqlQueryVariables, decodeGqlQuery, encodeGqlQuery)
import Browser
import Html exposing (..)
import Http
import Json.Encode

import BeneficiaryApp.Notebook exposing (rootDecoder, Root)


type alias Flags =
    { token : Token, serverUrl : String, beneficiaryId : String }


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Token =
    String


type alias GqlQuery =
    { query : String
    , operationName : String
    , variables : GqlVariables
    }


type alias GqlVariables =
    { id : String
    }


getBeneficiary : String -> String -> Token -> (Result Http.Error Root -> msg) -> Cmd msg
getBeneficiary beneficiaryId serverUrl token msg =
    let
        gqlQuery =
            { query = """query GetNotebookByBeneficiaryId($id: uuid!) {
  notebook(where: {beneficiaryId: {_eq: $id}}) {
    ...notebookFragment
    __typename
  }
}

fragment notebookFragment on notebook {
  id
  workSituation
  workSituationDate
  workSituationEndDate
  rightAre
  rightAss
  rightRsa
  rightRqth
  rightBonus
  contractType
  contractSignDate
  contractStartDate
  contractEndDate
  educationLevel
  wantedJobs {
    rome_code {
      id
      label
      __typename
    }
    __typename
  }
  geographicalArea
  beneficiary {
    address1
    address2
    cafNumber
    city
    dateOfBirth
    email
    firstname
    id
    lastname
    mobileNumber
    peNumber
    postalCode
    __typename
  }
  members(
    where: {active: {_eq: true}}
    order_by: {lastModifiedAt: desc_nulls_last}
  ) {
    id
    memberType
    lastModifiedAt
    lastVisitedAt
    account {
      type
      orientation_manager {
        id
        lastname
        firstname
        email
        phoneNumbers
        __typename
      }
      professional {
        id
        lastname
        firstname
        position
        email
        mobileNumber
        structure {
          id
          name
          address1
          address2
          postalCode
          city
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
  focuses(order_by: {createdAt: desc_nulls_first}) {
    theme
    situations
    creator {
      orientation_manager {
        firstname
        lastname
        __typename
      }
      professional {
        firstname
        lastname
        structure {
          name
          __typename
        }
        __typename
      }
      __typename
    }
    targets(
      where: {status: {_eq: "in_progress"}}
      order_by: {createdAt: desc_nulls_first}
    ) {
      target
      createdAt
      creator {
        orientation_manager {
          firstname
          lastname
          __typename
        }
        professional {
          firstname
          lastname
          structure {
            name
            __typename
          }
          __typename
        }
        __typename
      }
      actions(
        where: {status: {_eq: "in_progress"}}
        order_by: {createdAt: desc_nulls_first}
      ) {
        action
        createdAt
        status
        creator {
          orientation_manager {
            firstname
            lastname
            __typename
          }
          professional {
            firstname
            lastname
            structure {
              name
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}"""
            , operationName = "GetNotebookByBeneficiaryId"
            , variables = { id = beneficiaryId }
            }
    in
    Http.request
        { method = "POST"
        , headers = [ Http.header "authorization" ("Bearer " ++ token) ]
        , url = serverUrl
        , body = Http.jsonBody (encodeGqlQuery gqlQuery)
        , expect = Http.expectJson msg rootDecoder
        , timeout = Nothing
        , tracker = Nothing
        }



-- MODEL


type alias Model =
    { token : Token
    , serverUrl : String
    , beneficiaryId : String
    , beneficiaryContent : Maybe Root
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { token = flags.token
      , serverUrl = flags.serverUrl
      , beneficiaryId = flags.beneficiaryId
      , beneficiaryContent = Nothing
      }
    , Cmd.batch
        [ sendMessage "Out of elm"
        , getBeneficiary flags.beneficiaryId flags.serverUrl flags.token GotBeneficiary
        ]
    )



-- UPDATE


type Msg
    = Send
    | Recv String
    | GotBeneficiary (Result Http.Error Root)



-- Use the `sendMessage` port when someone presses ENTER or clicks
-- the "Send" button. Check out index.html to see the corresponding
-- JS where this is piped into a WebSocket.
--


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Send ->
            ( model
            , sendMessage "Out of elm"
            )

        GotBeneficiary result ->
            let
                _ = Debug.log "GotBeneficiary" result
            in
            case result of
                -- Do nothing for now
                Ok beneficiaryContent ->
                    ( { model | beneficiaryContent = Just beneficiaryContent} , Cmd.none )

                Err e ->
                    ( model, Cmd.none )

        Recv _ ->
            ( model, Cmd.none )



-- Subscribe to the `messageReceiver` port to hear about messages coming in
-- from JS. Check out the index.html file to see how this is hooked up to a
-- WebSocket.
--


subscriptions : Model -> Sub Msg
subscriptions _ =
    messageReceiver Recv



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ ul []
            [ li [] [ text "Beneficiary Elm App" ]
            , li [] [ text ("Token: " ++ model.token) ]
            , li [] [ text ("Server URL: " ++ model.serverUrl) ]
            , li [] [ text ("Beneficiary Id: " ++ model.beneficiaryId) ]
            ]
        , div []
            [ text <|
                case model.beneficiaryContent of
                    Nothing ->
                        "No content loaded"

                    Just content ->
                        case (List.head content.data.notebook) of
                            Just notebook -> "Got JSON for id: " ++ notebook.id
                            Nothing -> "No notebook found for beneficiary"
            ]
        ]



-- PORTS


port sendMessage : String -> Cmd msg


port messageReceiver : (String -> msg) -> Sub msg
