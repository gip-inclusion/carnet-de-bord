module Pages.Pro.Carnet.Action.List.Page exposing (Model, Msg, init, update, view)

import Api exposing (Api)
import Dict exposing (Dict)
import Domain.Action.Action exposing (Action)
import Domain.Action.Id
import Domain.Action.Statut exposing (StatutAction)
import Domain.Person
import Extra.Date
import Html
import Html.Attributes as Attr
import Html.Events as Evts
import Pages.Pro.Carnet.Action.List.ActionSelect
import Sentry



-- Init


type alias Model =
    { actions : Dict String Action
    , theme : String
    , searchSelect : Pages.Pro.Carnet.Action.List.ActionSelect.Model
    , api : Api
    }


init : { actions : List Action, api : Api, theme : String } -> Model
init { actions, api, theme } =
    { actions =
        actions
            |> List.map (\action -> ( action.id |> Domain.Action.Id.printId, action ))
            |> Dict.fromList
    , theme = theme
    , searchSelect =
        Pages.Pro.Carnet.Action.List.ActionSelect.init
            { api = api
            , errorLog = Sentry.sendError
            }
    , api = api
    }



-- Update


type Msg
    = Add
    | ChangedStatus String StatutAction
    | ActionSelectMsg Pages.Pro.Carnet.Action.List.ActionSelect.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Add ->
            ( model, Cmd.none )

        ChangedStatus id statut ->
            ( { model
                | actions =
                    model.actions
                        |> Dict.update id (Maybe.map (\action -> { action | statut = statut }))
              }
            , Cmd.none
            )

        ActionSelectMsg subMsg ->
            Pages.Pro.Carnet.Action.List.ActionSelect.update subMsg model.searchSelect
                |> Tuple.mapBoth
                    (\next -> { model | searchSelect = next })
                    (Cmd.map ActionSelectMsg)



-- View


view : Model -> Html.Html Msg
view props =
    Html.div [ Attr.class "pb-8" ]
        [ viewActions props
        , viewCreate props
        ]


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
                (model.actions |> Dict.toList |> List.map viewAction)
            ]
        ]


viewAction : ( String, Action ) -> Html.Html Msg
viewAction ( id, action ) =
    Html.tr []
        [ Html.td []
            [ Html.text action.description ]
        , Html.td []
            [ Html.text <| Domain.Person.printNom action.creePar ]
        , Html.td []
            [ Domain.Action.Statut.select
                { onSelect = ChangedStatus id
                , value = action.statut
                , id = id
                }
            ]
        , Html.td
            [ Attr.class "!text-right"
            ]
            [ Html.text <| Extra.Date.print action.dateDeDebut ]
        ]


viewCreate : Model -> Html.Html Msg
viewCreate props =
    Html.div
        [ Attr.class "py-1"
        ]
        [ Html.form
            [ Attr.class "pb-4"
            ]
            [ Html.div
                [ Attr.class "flex flex-row justify-between gap-6"
                ]
                [ Html.div
                    [ Attr.class "w-9/12"
                    ]
                    [ Pages.Pro.Carnet.Action.List.ActionSelect.view props.searchSelect
                        |> Html.map ActionSelectMsg
                    ]
                , Html.div
                    [ Attr.class "self-end w-3/12"
                    ]
                    [ addButton
                    ]
                ]
            ]
        ]


addButton : Html.Html Msg
addButton =
    Html.button
        [ Evts.onClick Add
        , Attr.class "fr-btn"
        ]
        [ Html.text "Ajouter" ]
