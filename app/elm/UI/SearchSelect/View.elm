module UI.SearchSelect.View exposing
    ( Init
    , Messages
    , Props
    , Status(..)
    , init
    , view
    )

import Html
import Html.Attributes as Attr
import Html.Events as Evts
import Html.Styled
import Select
import UI.Attributes



-- Props


type alias Props a =
    { id : String
    , status : Status a
    , label : String
    , state : Select.State
    , selected : Maybe a
    , optionLabel : a -> String
    , defaultOption : String
    , searchPlaceholder : String
    }


type alias Messages a msg =
    { onOpen : msg
    , onSelectMsg : Select.Msg a -> msg
    }


type Status a
    = Loading
    | NotAsked
    | Success (List a)
    | Failed



-- Init


type alias Init a =
    { id : String
    , label : String
    , selected : Maybe a
    , optionLabel : a -> String
    , defaultOption : String
    , searchPlaceholder : String
    }


init : Init a -> Props a
init params =
    { id = params.id
    , status = params.selected
                |> Maybe.map (List.singleton >> Success)
                |> Maybe.withDefault NotAsked
    , label = params.label
    , state = Select.initState <| Select.selectIdentifier params.id
    , selected = params.selected
    , optionLabel = params.optionLabel
    , defaultOption = params.defaultOption
    , searchPlaceholder = params.searchPlaceholder
    }



-- View


view :
    Props a
    -> Messages a msg
    -> Html.Html msg
view props { onOpen, onSelectMsg } =
    Html.div
        [ Attr.classList
            [ ( "fr-select-group", True )
            , ( "elm-select", True )
            , ( "fr-select-group--error"
              , props.status == Failed
              )
            ]
        ]
        [ Html.label [ Attr.class "fr-label" ] [ Html.text props.label ]
        , Html.button
            [ Attr.classList
                [ ( "fr-select", True )
                , ( "text-left", True )
                , ( "fr-select-group--error"
                  , props.status == Failed
                  )
                ]
            , Attr.type_ "button"
            , Evts.onClick onOpen
            , UI.Attributes.ariaExpanded (Select.isMenuOpen props.state)
            ]
            [ props.selected
                |> Maybe.map props.optionLabel
                |> Maybe.withDefault props.defaultOption
                |> Html.text
            ]
        , case props.status of
            Failed ->
                Html.p [ Attr.class "fr-error-text" ] [ Html.text "Votre recherche a échoué. Essayez en une autre ou contactez le support." ]

            _ ->
                if props.state |> Select.isMenuOpen then
                    Html.div []
                        [ Select.view
                            (Select.menu
                                |> Select.state props.state
                                |> Select.menuItems (menuItems props)
                                |> Select.placeholder props.searchPlaceholder
                                |> Select.loadingMessage "Chargement..."
                                |> Select.ariaDescribedBy ("select-usage-" ++ props.id)
                                |> Select.loading (props.status == Loading)
                            )
                            |> Html.Styled.toUnstyled
                            |> Html.map onSelectMsg
                        , Html.p
                            [ Attr.class "sr-only"
                            , Attr.id ("select-usage-" ++ props.id)
                            ]
                            [ Html.text "Utilisez les touches flèches pour naviguer dans la liste des suggestions"
                            ]
                        , Html.label
                            [ Attr.class "sr-only"
                            , Attr.for ("api-search-selector" ++ props.id ++ "__elm-select")
                            ]
                            [ Html.text props.searchPlaceholder ]
                        ]

                else
                    Html.text ""
        ]


menuItems : Props a -> List (Select.MenuItem a)
menuItems props =
    case props.status of
        Success data ->
            data
                |> List.map
                    (\value ->
                        Select.basicMenuItem
                            { item = value
                            , label = props.optionLabel value
                            }
                            |> Select.filterableMenuItem False
                    )

        _ ->
            []
