port module Pages.Pro.Carnet.Action.List.Main exposing (Flags, Model, Msg(..), ReadyMsg, State, main)

import BetaGouv.DSFR.Alert as Alert
import Browser
import Html
import Http
import Pages.Pro.Carnet.Action.List.ActionSelect as ActionSelect
import Pages.Pro.Carnet.Action.List.AllActions as AllActions exposing (Action)
import Pages.Pro.Carnet.Action.List.Page as Page
import Sentry


port refreshActions : (String -> msg) -> Sub msg


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- Init


type alias Flags =
    { theme : String
    , targetId : String
    }


type alias Model =
    { flags : Flags, state : State }


type State
    = Failed
    | Loading
    | Ready Page.Model


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { flags = flags, state = Loading }
    , AllActions.fetchAllByTargetId
        { id = flags.targetId
        , responseMsg = LoadedActions
        }
    )



-- Update


type Msg
    = ReadyMsg ReadyMsg
    | LoadedActions (Result Http.Error (List Action))


type ReadyMsg
    = PageMsg Page.Msg
    | RefreshActions
    | RefreshedActions (Result Http.Error (List Action))


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( model.state, msg ) of
        ( Ready pageModel, ReadyMsg readyMsg ) ->
            case readyMsg of
                PageMsg pageMsg ->
                    Page.update pageMsg pageModel
                        |> updateReady model

                RefreshActions ->
                    ( model
                    , AllActions.fetchAllByTargetId
                        { id = pageModel.targetId
                        , responseMsg = RefreshedActions >> ReadyMsg
                        }
                    )

                RefreshedActions result ->
                    case result of
                        Ok actions ->
                            Page.update (Page.Refreshed actions) pageModel
                                |> updateReady model

                        Err error ->
                            ( { model | state = Failed }, Sentry.reportHttpError error )

        ( Loading, LoadedActions result ) ->
            case result of
                Ok actions ->
                    Page.init
                        { theme = model.flags.theme
                        , targetId = model.flags.targetId
                        , actions = actions
                        , actionSearchApi = ActionSelect.apiSearch model.flags.theme
                        }
                        |> updateReady model

                Err error ->
                    ( { model | state = Failed }
                    , Sentry.reportHttpError error
                    )

        _ ->
            ( model, Cmd.none )


updateReady : Model -> ( Page.Model, Cmd Page.Msg ) -> ( Model, Cmd Msg )
updateReady model ( next, command ) =
    ( { model | state = Ready next }
    , Cmd.map (ReadyMsg << PageMsg) command
    )



-- subscriptions


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.state of
        Ready pageModel ->
            Sub.batch
                [ Page.subscriptions pageModel
                    |> Sub.map (ReadyMsg << PageMsg)
                , refreshActions <| always (ReadyMsg <| RefreshActions)
                ]

        _ ->
            Sub.none



-- view


view : Model -> Html.Html Msg
view model =
    case model.state of
        Ready pageModel ->
            Page.view pageModel
                |> Html.map (ReadyMsg << PageMsg)

        Failed ->
            Alert.small
                { title = Nothing
                , description =
                    "Les actions n'ont pas pu être chargées. "
                        ++ "L'équipe a été notifiée. "
                        ++ "Veuillez réessayer plus tard ou contactez le support."
                }
                |> Alert.alert Nothing Alert.error

        _ ->
            Html.text ""
