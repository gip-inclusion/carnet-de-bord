port module Pages.Pro.Carnet.Action.List.Page exposing (Model, Msg(..), init, subscriptions, update, view)

import BetaGouv.DSFR.Alert
import DateFormat
import Effect
import Extra.Date
import GraphQL.Enum.Action_status_enum
import Html
import Html.Attributes as Attr
import Pages.Pro.Carnet.Action.List.ActionStatusSelect
import Pages.Pro.Carnet.Action.List.AddForm as AddForm
import Pages.Pro.Carnet.Action.List.AllActions exposing (Action)
import Process
import Task
import UI.SearchSelect.SearchSelect as SearchSelect


type alias StatusUpdateOut =
    { actionId : String, status : String }


port updateStatus : StatusUpdateOut -> Cmd msg


port updateStatusFailed : (String -> msg) -> Sub msg



-- Init


type alias Model =
    { actions : List Action
    , addForm : AddForm.Model
    , statusUpdateFailed : Bool
    , targetId : String
    }


init :
    { actions : List Action
    , actionSearchApi : SearchSelect.SearchApi
    , theme : String
    , targetId : String
    }
    -> ( Model, Cmd Msg )
init { actions, actionSearchApi, theme, targetId } =
    let
        ( addForm, addFormCmd ) =
            AddForm.init
                { targetId = targetId
                , actionSearchApi = actionSearchApi
                , theme = theme
                }
    in
    ( { actions = actions
      , statusUpdateFailed = False
      , targetId = targetId
      , addForm = addForm
      }
    , addFormCmd |> Effect.map AddFormMsg |> Effect.perform
    )



-- Update


type Msg
    = Refreshed (List Action)
    | UpdateStatus String GraphQL.Enum.Action_status_enum.Action_status_enum
    | StatusUpdateFailed
    | AddFormMsg AddForm.Msg
    | DiscardStatusUpdateFailed


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdateStatus id status ->
            ( { model
                | actions =
                    model.actions
                        |> List.map
                            (\action ->
                                if action.id == id then
                                    { action | status = status }

                                else
                                    action
                            )
                , statusUpdateFailed = False
              }
            , updateStatus
                { actionId = id
                , status = GraphQL.Enum.Action_status_enum.toString status
                }
            )

        StatusUpdateFailed ->
            ( { model | statusUpdateFailed = True }
            , Process.sleep 10000 |> Task.perform (always DiscardStatusUpdateFailed)
            )

        Refreshed actions ->
            ( { model | actions = actions }
            , Cmd.none
            )

        AddFormMsg subMsg ->
            let
                ( addForm, addFormCmd ) =
                    AddForm.update subMsg model.addForm
            in
            ( { model | addForm = addForm }
            , addFormCmd |> Effect.map AddFormMsg |> Effect.perform
            )

        DiscardStatusUpdateFailed ->
            ( { model | statusUpdateFailed = False }, Cmd.none )



-- Subscription


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ updateStatusFailed <| always StatusUpdateFailed
        , AddForm.subscriptions model.addForm |> Sub.map AddFormMsg
        ]



-- View


view : Model -> Html.Html Msg
view model =
    Html.div [ Attr.class "pb-8 space-y-10" ]
        [ Html.div [ Attr.class "space-y-1" ]
            [ viewActionsError model
            , viewActions model
            ]
        , AddForm.view model.addForm
            |> Html.map AddFormMsg
        ]


viewActionsError : Model -> Html.Html Msg
viewActionsError model =
    if model.statusUpdateFailed then
        BetaGouv.DSFR.Alert.small
            { title = Just "La mise à jour du statut a échoué."
            , description =
                "Essayez de rafraîchir la page puis de recommencer. "
                    ++ "Si le problème persiste, merci de contacter le support."
            }
            |> BetaGouv.DSFR.Alert.alert Nothing BetaGouv.DSFR.Alert.error

    else
        Html.text ""


viewActions : Model -> Html.Html Msg
viewActions model =
    Html.div
        [ Attr.class "w-full fr-table fr-table--layout-fixed" ]
        [ Html.table
            [ Attr.class "w-full" ]
            [ Html.caption
                [ Attr.class "sr-only" ]
                [ Html.text "Actions en cours" ]
            , Html.thead []
                [ Html.tr []
                    [ Html.th
                        [ Attr.class "min-w-min"
                        ]
                        [ Html.text "Action" ]
                    , Html.th
                        [ Attr.class "min-w-min"
                        ]
                        [ Html.text "Créée par" ]
                    , Html.th
                        [ Attr.class "w-40"
                        ]
                        [ Html.text "Statut" ]
                    , Html.th
                        [ Attr.class "min-w-min !text-right"
                        ]
                        [ Html.text "Date de début" ]
                    ]
                ]
            , Html.tbody
                [ Attr.class "w-full"
                ]
                (case model.actions of
                    [] ->
                        [ Html.tr []
                            [ Html.td [ Attr.colspan 4 ]
                                [ Html.text "Aucune action entreprise pour le moment." ]
                            ]
                        ]

                    _ ->
                        model.actions |> List.map viewAction
                )
            ]
        ]


viewAction : Action -> Html.Html Msg
viewAction action =
    Html.tr []
        [ Html.td [ Attr.class "break-words" ]
            [ Html.text action.description ]
        , Html.td []
            [ Html.text <| action.creator.firstName ++ " " ++ action.creator.lastName ]
        , Html.td []
            [ Pages.Pro.Carnet.Action.List.ActionStatusSelect.select
                { onSelect = UpdateStatus action.id
                , value = action.status
                , id = action.id
                }
            ]
        , Html.td
            [ Attr.class "!text-right"
            ]
            [ Html.text <| DateFormat.format "dd/MM/yyyy" Extra.Date.parisZone action.startingAt ]
        ]
