module Pages.Pro.Carnet.Action.List.View exposing (Props, view)

import Domain.Action.Action exposing (Action)
import Domain.Action.Id
import Domain.Action.Statut
import Domain.Person
import Extra.Date
import Html
import Html.Attributes as Attr


type alias Props msg =
    { actions : List Action
    , onSelect : Domain.Action.Id.ActionId -> Domain.Action.Statut.StatutAction -> msg
    }


view : Props msg -> Html.Html msg
view props =
    Html.div [ Attr.class "pb-8" ]
        [ viewActions props
        , viewCreate
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
                { onSelect = props.onSelect action.id
                , value = action.statut
                }
            ]
        , Html.td
            [ Attr.class "!text-right"
            ]
            [ Html.text <| Extra.Date.print action.dateDeDebut ]
        ]


viewCreate : Html.Html msg
viewCreate =
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
                    [ Html.text "autocomplete" ]
                , Html.div
                    [ Attr.class "self-end w-3/12"
                    ]
                    [ addButton
                    ]
                ]
            ]
        ]


addButton : Html.Html msg
addButton =
    Html.button
        [ Attr.type_ "submit", Attr.class "fr-btn" ]
        [ Html.text "Ajouter" ]
