module Pages.Carnet.Diagnostic.PoleEmploi.Main exposing (Flags, Model, main)

import Browser
import Effect
import Html
import Pages.Carnet.Diagnostic.PoleEmploi.Page as Page


main : Program Flags Model Page.Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


type alias Flags =
    { notebookId : String }


type alias Model =
    { page : Page.Model }


init : Flags -> ( Model, Cmd Page.Msg )
init flags =
    let
        ( model, effect ) =
            Page.init flags
    in
    ( { page = model }, Effect.perform effect )


update : Page.Msg -> Model -> ( Model, Cmd Page.Msg )
update msg model =
    let
        ( pageModel, pageEffect ) =
            Page.update msg model.page
    in
    ( { page = pageModel }, Effect.perform pageEffect )


view : Model -> Html.Html Page.Msg
view model =
    Page.view model.page
