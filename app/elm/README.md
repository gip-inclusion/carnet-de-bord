# Commencer avec Elm

## Initialiser un composant

- créer un dossier avec le nom du composant
- créer un fichier Main.elm et son fichier de typings (qui servira pour l'import coté svelte) sur la base des fichiers ci dessous.

Bien faire attention que le nom du dossier corresponde au nom du namespace car celui-ci sera utilisé dans la partie svelte.

Pour utiliser le composant Elm dans svelte

```svelte
	import { Elm } from '../../../../elm/MainApp/Main.elm';
	import { afterUpdate } from 'svelte';

	let elmNode: HTMLElement;
	afterUpdate(() => {
		if (!elmNode) return;
		Elm.MainApp.Main.init({
			node: elmNode,
			flags: {
				...some_data
			},
		});
	});

<div>
	<!-- Elm app needs to be wrapped by a div to avoid navigation exceptions when unmounting -->
	<div bind:this={elmNode} />
</div>
```

Exemple d'application Elm

```elm
port module MainApp.Main exposing (..)

import Browser
import Html exposing (..)


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    {}


init : () -> ( Model, Cmd Msg )
init _ =
    ( {}
    , sendMessage "Out of elm"
    )



-- UPDATE


type Msg
    = Send
    | Recv String



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
view _ =
    div []
        [ text "Hello from Main Elm" ]



-- PORTS


port sendMessage : String -> Cmd msg


port messageReceiver : (String -> msg) -> Sub msg
```
