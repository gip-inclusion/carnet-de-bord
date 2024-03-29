port module Storybook.Component exposing
    ( Component
    , stateless, sandbox
    , ComponentModel
    )

{-|

@docs Component
@docs stateless, sandbox

-}

import Browser
import Html exposing (Html)
import Json.Encode as Json
import Storybook.Controls


type alias Component model msg =
    Program
        Json.Value
        (ComponentModel model)
        msg


stateless :
    { view : controls -> Html msg
    , controls : Storybook.Controls.Decoder controls
    }
    -> Component () msg
stateless options =
    let
        view : ComponentModel () -> Html msg
        view model =
            options.controls
                |> Storybook.Controls.decode model.controls
                |> options.view
    in
    Browser.element
        { init =
            \json ->
                ( { controls = json
                  , component = ()
                  }
                , Cmd.none
                )
        , update = update (\_ model -> ( model, Cmd.none ))
        , view = view
        , subscriptions = \_ -> Sub.none
        }


sandbox :
    { controls : Storybook.Controls.Decoder controls
    , init : ( model, Cmd msg )
    , update : msg -> model -> ( model, Cmd msg )
    , view : controls -> model -> Html msg
    }
    -> Component model msg
sandbox options =
    let
        ( componentModel, componentCmd ) =
            options.init

        init : Json.Value -> ( ComponentModel model, Cmd msg )
        init json =
            ( { controls = json
              , component = componentModel
              }
            , componentCmd
            )

        view : ComponentModel model -> Html msg
        view model =
            options.view
                (Storybook.Controls.decode
                    model.controls
                    options.controls
                )
                model.component
    in
    Browser.element
        { init = init
        , update = update options.update
        , view = view
        , subscriptions = \_ -> Sub.none
        }



-- INTERNALS


{-| We wrap the components `model` with our own, so we can
track the component's state, but also store the Storybook
controls passed in as flags by `.storybook/elm-storybook/index.js`
-}
type alias ComponentModel model =
    { controls : Json.Value
    , component : model
    }


{-| Rather than just handling the message using the
component's `update` function, we use the `logAction` port
to let Storybook's "Actions" tab log which Elm message was
sent.
-}
update :
    (msg -> model -> ( model, Cmd msg ))
    -> msg
    -> ComponentModel model
    -> ( ComponentModel model, Cmd msg )
update componentUpdateFn msg model =
    let
        ( nextComponent, command ) =
            componentUpdateFn msg model.component
    in
    ( { model | component = nextComponent }
    , Cmd.batch
        [ logAction
            { payload = Json.string (Debug.toString msg)
            }
        , command
        ]
    )


{-| This port allows us to send messages to JavaScript!
In this case, it means we can tell Storybook about Elm messages so
it can log them in the "Actions" tab
-}
port logAction : { payload : Json.Value } -> Cmd msg
