port module Pages.Pro.Carnet.Action.List.AddForm exposing (Model, Msg(..), init, subscriptions, update, view)

import BetaGouv.DSFR.Alert
import BetaGouv.DSFR.Input
import Date
import Effect exposing (Effect)
import GraphQL.Enum.Action_status_enum
import Html
import Html.Attributes as Attr
import Html.Events as Evts
import Pages.Pro.Carnet.Action.List.ActionSelect as ActionSelect
import Process
import Task
import Time
import UI.SearchSelect.SearchSelect as SearchSelect


port addAction :
    { targetId : String
    , action : String
    , status : String
    , startingAt : String
    }
    -> Cmd msg


port hasAddSucceeded : (Bool -> msg) -> Sub msg



-- Init


type alias Model =
    { action : ActionSelect.Model
    , startingAt : String
    , startingAtError : Maybe String
    , submitFailed : Bool
    , targetId : String
    }


parse : Model -> Result () { action : String, startingAt : Date.Date }
parse model =
    let
        maybeAction =
            model.action |> ActionSelect.getSelected

        dateResult =
            model.startingAt |> Date.fromIsoString
    in
    case ( maybeAction, dateResult ) of
        ( Just action, Ok date ) ->
            Ok
                { action = action.label
                , startingAt = date
                }

        _ ->
            Err ()


init :
    { targetId : String
    , theme : String
    , actionSearchApi : SearchSelect.SearchApi
    }
    -> ( Model, Effect Msg )
init { targetId, theme, actionSearchApi } =
    let
        ( actionSelect, actionCommand ) =
            ActionSelect.init { actionSearchApi = actionSearchApi, theme = theme }
    in
    ( { action = actionSelect
      , startingAt = ""
      , startingAtError = Nothing
      , submitFailed = False
      , targetId = targetId
      }
    , Effect.batch
        [ actionCommand |> Effect.fromCmd |> Effect.map ActionMsg
        , Effect.now GotTime
        ]
    )



-- Update


type Msg
    = ActionMsg ActionSelect.Msg
    | ChooseDate String
    | Submit
    | HasSubmitSucceeded Bool
    | DiscardSubmitError
    | GotTime Time.Posix


update : Msg -> Model -> ( Model, Effect Msg )
update msg model =
    case msg of
        Submit ->
            ( { model
                | submitFailed = False
              }
            , case parse model of
                Ok { action, startingAt } ->
                    addAction
                        { targetId = model.targetId
                        , action = action
                        , startingAt = Date.toIsoString startingAt
                        , status = GraphQL.Enum.Action_status_enum.In_progress |> GraphQL.Enum.Action_status_enum.toString
                        }
                        |> Effect.fromCmd

                Err _ ->
                    Effect.none
            )

        ActionMsg subMsg ->
            let
                ( actionSelect, actionCommand ) =
                    ActionSelect.update subMsg model.action
            in
            ( { model | action = actionSelect }
            , actionCommand |> Effect.fromCmd |> Effect.map ActionMsg
            )

        ChooseDate date ->
            ( { model | startingAt = date }, Effect.none )

        HasSubmitSucceeded success ->
            if success then
                let
                    ( nextSelect, selectCmd ) =
                        ActionSelect.reset model.action
                in
                ( { model | action = nextSelect }
                , Effect.batch
                    [ selectCmd
                        |> Effect.fromCmd
                        |> Effect.map ActionMsg
                    , Effect.now GotTime
                    ]
                )

            else
                ( { model | submitFailed = True }
                , Process.sleep 10000 |> Task.perform (always DiscardSubmitError) |> Effect.fromCmd
                )

        DiscardSubmitError ->
            ( { model | submitFailed = False }, Effect.none )

        GotTime time ->
            ( { model | startingAt = time |> Date.fromPosix Time.utc |> Date.format "YYYY-MM-dd" }, Effect.none )



-- Subscription


subscriptions : Model -> Sub Msg
subscriptions _ =
    hasAddSucceeded HasSubmitSucceeded



-- View


view : Model -> Html.Html Msg
view model =
    Html.div []
        [ Html.form
            [ Attr.class "pb-4"
            , Evts.onSubmit Submit
            ]
            [ Html.div
                [ Attr.class "flex justify-between space-x-4"
                ]
                [ Html.div
                    [ Attr.class "grow"
                    ]
                    [ ActionSelect.view model.action
                        |> Html.map ActionMsg
                    ]
                , BetaGouv.DSFR.Input.new
                    { id = "add-action-date"
                    , onInput = ChooseDate
                    , label = Html.text "Date de début"
                    , value = model.startingAt
                    }
                    |> BetaGouv.DSFR.Input.date
                    |> BetaGouv.DSFR.Input.view
                , Html.div
                    [ Attr.class "self-start mt-8"
                    ]
                    [ addButton model
                    ]
                ]
            ]
        , if model.submitFailed then
            BetaGouv.DSFR.Alert.small
                { title = Just "L'ajout de l'action a échoué"
                , description =
                    "Essayez de rafraîchir la page puis de recommencer. "
                        ++ "Si le problème persiste, veuillez contactez le support."
                }
                |> BetaGouv.DSFR.Alert.alert Nothing BetaGouv.DSFR.Alert.error
                |> List.singleton
                |> Html.div [ Attr.class "py-2" ]

          else
            Html.text ""
        ]


addButton : Model -> Html.Html Msg
addButton model =
    Html.button
        [ Attr.class "fr-btn"
        , Attr.disabled <| parse model == Err ()
        , Attr.type_ "submit"
        ]
        [ Html.text "Ajouter" ]
