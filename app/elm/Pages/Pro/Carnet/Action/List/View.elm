module Pages.Pro.Carnet.Action.List.View exposing (Init, Props, init, view)

import Domain.Action.Action exposing (Action)
import Domain.Action.Id
import Domain.Action.Statut
import Domain.Person
import Extra.Date
import Html
import Html.Attributes as Attr
import Html.Events as Evts
import Select
import UI.SearchSelect.View



-- Props


type alias Props msg =
    { actions : List Action
    , messages :
        { onStatusSelect : Domain.Action.Id.ActionId -> Domain.Action.Statut.StatutAction -> msg
        , onAdd : msg
        }
    , search :
        { messages : UI.SearchSelect.View.Messages Action msg
        , props : UI.SearchSelect.View.Props Action
        }
    }



-- Init


type alias Init msg =
    { actions : List Action
    , messages :
        { onStatusSelect : Domain.Action.Id.ActionId -> Domain.Action.Statut.StatutAction -> msg
        , onAdd : msg
        }
    , search :
        { messages : UI.SearchSelect.View.Messages Action msg
        , init : UI.SearchSelect.View.Init Action
        }
    }


init : Init msg -> Props msg
init params =
    { actions = params.actions
    , messages = params.messages
    , search =
        { messages = params.search.messages
        , props = UI.SearchSelect.View.init params.search.init
        }
    }



-- View


view : Props msg -> Html.Html msg
view props =
    Html.div [ Attr.class "pb-8" ]
        [ viewActions props
        , viewCreate props
        ]


viewActions : Props msg -> Html.Html msg
viewActions props =
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
                (props.actions |> List.map (viewAction props))
            ]
        ]


viewAction : Props msg -> Action -> Html.Html msg
viewAction props action =
    Html.tr []
        [ Html.td []
            [ Html.text action.description ]
        , Html.td []
            [ Html.text <| Domain.Person.printNom action.creePar ]
        , Html.td []
            [ Domain.Action.Statut.select
                { onSelect = props.messages.onStatusSelect action.id
                , value = action.statut
                }
            ]
        , Html.td
            [ Attr.class "!text-right"
            ]
            [ Html.text <| Extra.Date.print action.dateDeDebut ]
        ]


viewCreate : Props msg -> Html.Html msg
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
                    [ UI.SearchSelect.View.view
                        { id = "action-select"
                        , status = UI.SearchSelect.View.NotAsked
                        , label = "Actions"
                        , state = Select.initState <| Select.selectIdentifier "action-select"
                        , selected = Nothing
                        , optionLabel = always "Pas traduit encore"
                        , defaultOption = "Sélectionner une action"
                        , searchPlaceholder = "Rechercher une action"
                        }
                        props.search.messages
                    ]
                , Html.div
                    [ Attr.class "self-end w-3/12"
                    ]
                    [ addButton props
                    ]
                ]
            ]
        ]


addButton : Props msg -> Html.Html msg
addButton props =
    Html.button
        [ Evts.onClick props.messages.onAdd
        , Attr.class "fr-btn"
        ]
        [ Html.text "Ajouter" ]
