port module Pages.Pro.Carnet.Action.List.Page exposing (Error(..), Model, Msg(..), init, subscriptions, update, view)

import Api exposing (Api)
import BetaGouv.DSFR.Alert
import Dict exposing (Dict)
import Domain.Action.Id
import Domain.Action.Status exposing (ActionStatus)
import Extra.Date
import Html
import Html.Attributes as Attr
import Html.Events as Evts
import Pages.Pro.Carnet.Action.List.ActionSelect
import Pages.Pro.Carnet.Action.List.AllActions exposing (Action)


type alias StatusUpdateOut =
    { actionId : String, status : String }


port updateStatus : StatusUpdateOut -> Cmd msg


port updateStatusFailed : (String -> msg) -> Sub msg


port addAction :
    { targetId : String
    , action : String
    , status : String
    }
    -> Cmd msg


port addFailed : (String -> msg) -> Sub msg



-- Init


type alias Model =
    { actions : Dict String Action
    , theme : String
    , actionSelect : Pages.Pro.Carnet.Action.List.ActionSelect.Model
    , api : Api
    , error : Maybe Error
    , targetId : String
    }


type Error
    = LineError
    | AddError


init :
    { actions : List Action
    , api : Api
    , theme : String
    , targetId : String
    }
    -> ( Model, Cmd Msg )
init { actions, api, theme, targetId } =
    let
        ( actionSelect, actionSelectCmd ) =
            Pages.Pro.Carnet.Action.List.ActionSelect.init { api = api }
    in
    ( { actions = toActionDict actions
      , theme = theme
      , actionSelect = actionSelect
      , api = api
      , error = Nothing
      , targetId = targetId
      }
    , actionSelectCmd |> Cmd.map ActionSelectMsg
    )


toActionDict : List Action -> Dict String Action
toActionDict actions =
    actions
        |> List.map (\action -> ( action.id |> Domain.Action.Id.printId, action ))
        |> Dict.fromList



-- Update


type Msg
    = Add
    | Refreshed (List Action)
    | AddFailed
    | ChangedStatus String ActionStatus
    | StatusUpdateFailed
    | ActionSelectMsg Pages.Pro.Carnet.Action.List.ActionSelect.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Add ->
            ( { model | error = Nothing }
            , case model.actionSelect |> Pages.Pro.Carnet.Action.List.ActionSelect.getSelected of
                Just action ->
                    addAction
                        { targetId = model.targetId
                        , action = action.description
                        , status = Domain.Action.Status.InProgress |> Domain.Action.Status.codeOf
                        }

                Nothing ->
                    Cmd.none
            )

        ChangedStatus id statut ->
            ( { model
                | actions =
                    model.actions
                        |> Dict.update id (Maybe.map (\action -> { action | statut = statut }))
                , error = Nothing
              }
            , updateStatus { actionId = id, status = Domain.Action.Status.codeOf statut }
            )

        ActionSelectMsg subMsg ->
            Pages.Pro.Carnet.Action.List.ActionSelect.update subMsg model.actionSelect
                |> Tuple.mapBoth
                    (\next -> { model | actionSelect = next })
                    (Cmd.map ActionSelectMsg)

        StatusUpdateFailed ->
            ( { model | error = Just LineError }, Cmd.none )

        Refreshed actions ->
            ( { model
                | actions =
                    actions
                        |> toActionDict
                        |> Dict.union model.actions
              }
            , Cmd.none
            )

        AddFailed ->
            ( { model | error = Just AddError }, Cmd.none )



-- Subscription


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ updateStatusFailed <| always StatusUpdateFailed
        , addFailed <| always AddFailed
        ]



-- View


view : Model -> Html.Html Msg
view model =
    Html.div [ Attr.class "pb-8 space-y-10" ]
        [ Html.div [ Attr.class "space-y-1" ]
            [ viewActionsError model
            , viewActions model
            ]
        , viewCreate model
        ]


viewActionsError : Model -> Html.Html Msg
viewActionsError model =
    if model.error == Just LineError then
        BetaGouv.DSFR.Alert.small
            { title = Nothing
            , description = "La mise à jour du statut a échoué. Essayez de rafraîchir la page puis de recommencer. Si le problème persiste, merci de contacter le support."
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
                (if model.actions |> Dict.isEmpty then
                    [ Html.tr [] [ Html.td [ Attr.colspan 4 ] [ Html.text "Aucune action entreprise pour le moment." ] ] ]

                 else
                    model.actions |> Dict.toList |> List.map viewAction
                )
            ]
        ]


viewAction : ( String, Action ) -> Html.Html Msg
viewAction ( id, action ) =
    Html.tr []
        [ Html.td []
            [ Html.text action.description ]
        , Html.td []
            [ Html.text <| action.creator.firstName ++ " " ++ action.creator.lastName ]
        , Html.td []
            [ Domain.Action.Status.select
                { onSelect = ChangedStatus id
                , value = action.statut
                , id = id
                }
            ]
        , Html.td
            [ Attr.class "!text-right"
            ]
            [ Html.text <| Extra.Date.print action.startingAt ]
        ]


viewCreate : Model -> Html.Html Msg
viewCreate props =
    Html.div []
        [ Html.form
            [ Attr.class "pb-4"
            ]
            [ Html.div
                [ Attr.class "flex justify-between space-x-4"
                ]
                [ Html.div
                    [ Attr.class "grow"
                    ]
                    [ Pages.Pro.Carnet.Action.List.ActionSelect.view props.actionSelect
                        |> Html.map ActionSelectMsg
                    ]
                , Html.div
                    [ Attr.class "self-end"
                    ]
                    [ addButton props
                    ]
                ]
            ]
        , if props.error == Just AddError then
            BetaGouv.DSFR.Alert.small
                { title = Nothing
                , description =
                    "L'ajout de l'action a échoué. Essayez de rafraîchir la page puis de recommencer. "
                        ++ "Si le problème persiste, contactez le support."
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
        [ Evts.onClick Add
        , Attr.class "fr-btn"
        , Pages.Pro.Carnet.Action.List.ActionSelect.getSelected model.actionSelect
            |> (==) Nothing
            |> Attr.disabled
        ]
        [ Html.text "Ajouter" ]
