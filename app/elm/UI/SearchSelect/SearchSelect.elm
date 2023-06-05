module UI.SearchSelect.SearchSelect exposing (Mode(..), Model, Msg(..), Option, SearchApi, Status, getSelected, init, reset, update, view)

{-| Documentation et exemple sur elm-book. Rome.Select utilise également ce composant pour exemple.
-}

import Debouncer.Messages as Debouncer exposing (debounce, fromSeconds, provideInput, toDebouncer)
import Extra.Http
import Html
import Html.Attributes as Attr
import Html.Events as Evts
import Html.Styled
import Http
import Select
import Sentry
import UI.Attributes



-- Init


type alias Option =
    { id : String, label : String }


type alias SearchApi =
    { search : String
    , callbackMsg : Result Http.Error (List Option) -> Msg
    }
    -> Cmd Msg


type Mode
    = Autocomplete
    | Classic


type alias Model =
    { id : String
    , status : Status
    , label : String
    , state : Select.State
    , selected : Maybe Option
    , defaultOption : String
    , searchPlaceholder : String
    , debouncer : Debouncer.Debouncer Msg
    , api : SearchApi
    , search : String
    , mode : Mode
    }


type Status
    = Loading
    | NotAsked
    | Success (List Option)
    | Failed


init :
    { id : String
    , selected : Maybe Option
    , api : SearchApi
    , label : String
    , searchPlaceholder : String
    , defaultOption : String
    , mode : Mode
    }
    -> Model
init props =
    { id = props.id
    , status =
        props.selected
            |> Maybe.map (List.singleton >> Success)
            |> Maybe.withDefault NotAsked
    , label = props.label
    , state = Select.initState <| Select.selectIdentifier props.id
    , defaultOption = props.defaultOption
    , searchPlaceholder = props.searchPlaceholder
    , selected = props.selected
    , debouncer = debounce (fromSeconds 0.5) |> toDebouncer
    , api = props.api
    , search = ""
    , mode = props.mode
    }


getSelected : Model -> Maybe Option
getSelected model =
    model.selected


reset : Model -> Model
reset model =
    { model
        | status = NotAsked
        , state = Select.initState <| Select.selectIdentifier model.id
        , selected = Nothing
        , search = ""
    }



-- Update


type Msg
    = Fetched (Result Http.Error (List Option))
    | Search String
    | Open
    | SelectMsg (Select.Msg Option)
    | Select Option
    | DebouncerMsg (Debouncer.Msg Msg)
    | Reset


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SelectMsg selectMsg ->
            let
                ( action, updatedSelectState, selectCmds ) =
                    Select.update selectMsg model.state

                newModel =
                    { model | state = updatedSelectState }

                command =
                    Cmd.map SelectMsg selectCmds
            in
            case action of
                Just (Select.Select selected) ->
                    ( { newModel | selected = Just selected, search = "" }
                    , command
                    )

                Just (Select.InputChange value) ->
                    let
                        ( debouncerModel, debouncerCmds ) =
                            Debouncer.update update
                                debouncerConfig
                                (Search value
                                    |> provideInput
                                )
                                { newModel | search = value }
                    in
                    ( debouncerModel, Cmd.batch [ command, debouncerCmds ] )

                _ ->
                    ( newModel, command )

        Open ->
            let
                selectElement =
                    Select.initState
                        (Select.selectIdentifier
                            ("api-search-selector"
                                ++ model.id
                            )
                        )

                -- Because it's being used as dropdown we want fresh state
                -- every time an action is clicked.
                ( _, focusedSelectState, cmds ) =
                    -- Focusing the select. Using the Select Cmd
                    -- ensures the menu is open on focus which is what you probably want
                    -- for dropdown menu.
                    Select.update Select.focus selectElement
            in
            ( { model | state = focusedSelectState }
            , Cmd.map SelectMsg cmds
            )

        Search searchString ->
            ( { model | status = Loading }
            , model.api { search = searchString, callbackMsg = Fetched }
            )

        Fetched result ->
            case result of
                Ok values ->
                    ( { model | status = values |> Success }
                    , Cmd.none
                    )

                Err httpError ->
                    ( { model | status = Failed }
                    , Sentry.sendError <| Extra.Http.toString httpError
                    )

        DebouncerMsg subMsg ->
            Debouncer.update update debouncerConfig subMsg model

        Select value ->
            ( { model | selected = Just value }, Cmd.none )

        Reset ->
            ( reset model, Cmd.none )


debouncerConfig : Debouncer.UpdateConfig Msg Model
debouncerConfig =
    { mapMsg = DebouncerMsg
    , getDebouncer = .debouncer
    , setDebouncer = \debouncer model -> { model | debouncer = debouncer }
    }



-- View


view : Model -> Html.Html Msg
view model =
    Html.div
        [ Attr.classList
            [ ( "fr-select-group", True )
            , ( "elm-select", True )
            , ( "fr-select-group--error"
              , model.status == Failed
              )
            ]
        ]
        [ Html.label [ Attr.class "fr-label" ] [ Html.text model.label ]
        , Html.button
            [ Attr.classList
                [ ( "fr-select", True )
                , ( "text-left", True )
                , ( "fr-select-group--error"
                  , model.status == Failed
                  )
                ]
            , Attr.type_ "button"
            , Evts.onClick Open
            , UI.Attributes.ariaExpanded (Select.isMenuOpen model.state)
            ]
            [ model.selected
                |> Maybe.map .label
                |> Maybe.withDefault model.defaultOption
                |> Html.text
            ]
        , case model.status of
            Failed ->
                Html.p
                    [ Attr.class "fr-error-text" ]
                    [ Html.text "Votre recherche a échoué. Essayez en une autre ou contactez le support." ]

            _ ->
                if model.state |> Select.isMenuOpen then
                    Html.div []
                        [ Select.view
                            (Select.menu
                                |> Select.state model.state
                                |> Select.menuItems (menuItems model)
                                |> Select.placeholder model.searchPlaceholder
                                |> Select.loadingMessage "Chargement..."
                                |> Select.ariaDescribedBy ("select-usage-" ++ model.id)
                                |> Select.loading (model.status == Loading)
                            )
                            |> Html.Styled.toUnstyled
                            |> Html.map SelectMsg
                        , Html.p
                            [ Attr.class "sr-only"
                            , Attr.id ("select-usage-" ++ model.id)
                            ]
                            [ Html.text "Utilisez les touches flèches pour naviguer dans la liste des suggestions"
                            ]
                        , Html.label
                            [ Attr.class "sr-only"
                            , Attr.for ("api-search-selector" ++ model.id ++ "__elm-select")
                            ]
                            [ Html.text model.searchPlaceholder ]
                        ]

                else
                    Html.text ""
        ]


menuItems : Model -> List (Select.MenuItem Option)
menuItems model =
    (case model.status of
        Success data ->
            data |> List.map optionToSelectItem

        _ ->
            []
    )
        |> addAutocompleteOption model


addAutocompleteOption : Model -> List (Select.MenuItem Option) -> List (Select.MenuItem Option)
addAutocompleteOption model =
    case model.mode of
        Classic ->
            identity

        Autocomplete ->
            if model.search |> String.trim |> String.isEmpty then
                identity

            else
                { id = "custom-search-select-option"
                , label = model.search
                }
                    |> optionToSelectItem
                    |> (::)


optionToSelectItem : Option -> Select.MenuItem Option
optionToSelectItem value =
    Select.basicMenuItem
        { item = value
        , label = value.label
        }
        |> Select.filterableMenuItem False
