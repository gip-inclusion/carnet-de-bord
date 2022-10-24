port module BeneficiaryApp.Main exposing (..)

import Browser
import Html exposing (..)
import Http


type alias Flags =
    { token : Token, serverUrl : String }


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


getBeneficiary : String -> Token -> (Result Http.Error String -> msg) -> Cmd msg
getBeneficiary serverUrl token msg =
    Http.request
        { method = "POST"
        , headers = [ Http.header "authorization" ("Bearer " ++ token) ]
        , url = serverUrl
        , body = Http.emptyBody
        , expect = Http.expectString msg
        , timeout = Nothing
        , tracker = Nothing
        }



-- MODEL


type alias Model =
    { token : Token
    , serverUrl : String
    }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { token = flags.token, serverUrl = flags.serverUrl }
    , Cmd.batch [ sendMessage "Out of elm", getBeneficiary flags.serverUrl flags.token SongReceived ]
    )



-- UPDATE


type Msg
    = Send
    | Recv String
    | SongReceived (Result Http.Error String)



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

        SongReceived result ->
            case result of
                -- Do nothing for now
                Ok beneficiaryContent ->
                    ( model, Cmd.none )

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
            ]
        ]



-- PORTS


port sendMessage : String -> Cmd msg


port messageReceiver : (String -> msg) -> Sub msg
