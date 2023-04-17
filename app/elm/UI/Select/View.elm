module UI.Select.View exposing (Props, view)

import Html exposing (Html)
import Html.Attributes as Attr
import Html.Events as Evts


type alias Props option msg =
    { id : String
    , label : String
    , options : List option
    , print : option -> String
    , onSelect : option -> msg
    , selected : Maybe option
    }


view : Props option msg -> Html msg
view props =
    Html.div
        [ Attr.class "fr-select-group"
        ]
        [ Html.label
            [ Attr.class "fr-label"
            , Attr.for props.id
            ]
            [ Html.text props.label ]
        , Html.select
            [ Attr.class "fr-select"
            , Attr.id props.id
            ]
            (viewLabelOption props :: viewOptions props)
        ]


viewLabelOption : Props option msg -> Html msg
viewLabelOption props =
    Html.option
        [ Attr.value ""
        , Attr.selected (props.selected == Nothing)
        , Attr.disabled True
        , Attr.hidden True
        ]
        [ Html.text "Selectionnez une option" ]


viewOptions : Props option msg -> List (Html msg)
viewOptions props =
    props.options
        |> List.map
            (\option ->
                Html.option
                    [ Evts.onClick (props.onSelect option)
                    , Attr.selected (props.selected == Just option)
                    ]
                    [ Html.text <| props.print option ]
            )
