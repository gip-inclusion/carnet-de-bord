module DiagnosticEdit.Main exposing (..)

import Browser
import Html exposing (..)


type alias Flags =
    {}


main : Program Flags Model msg
main =
    Browser.element
        { init = init
        , view = view
        , update = \_ model -> ( model, Cmd.none )
        , subscriptions = \_ -> Sub.none
        }



-- MODEL


type alias Model =
    {}



-- INIT


init : Flags -> ( Model, Cmd msg )
init _ =
    ( {}
    , Cmd.none
    )



-- VIEW


view : Model -> Html msg
view _ =
    div [] [ text "Hello from Elm" ]
