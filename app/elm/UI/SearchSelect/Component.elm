module UI.SearchSelect.Component exposing (Model, Msg(..), Option, SearchApi, getSelected, init, reset, update, view)

{-| Documentation et exemple sur elm-book. Rome.Select utilise également ce composant pour exemple.
-}

import Debouncer.Messages as Debouncer exposing (debounce, fromSeconds, provideInput, toDebouncer)
import Extra.Http
import Html
import Http
import Select
import Sentry
import UI.SearchSelect.View



-- Init


type alias Option =
    { id : String, label : String }


type alias SearchApi =
    { search : String
    , callbackMsg : Result Http.Error (List Option) -> Msg
    }
    -> Cmd Msg


type alias Model =
    { props : UI.SearchSelect.View.Props Option
    , selected : Maybe Option
    , debouncer : Debouncer.Debouncer Msg
    , api : SearchApi
    }


init :
    { id : String
    , selected : Maybe Option
    , api : SearchApi
    , label : String
    , searchPlaceholder : String
    , defaultOption : String
    }
    -> Model
init props =
    { props =
        UI.SearchSelect.View.init
            { id = props.id
            , selected = props.selected
            , optionLabel = .label
            , label = props.label
            , searchPlaceholder = props.searchPlaceholder
            , defaultOption = props.defaultOption
            }
    , selected = props.selected
    , debouncer = debounce (fromSeconds 0.5) |> toDebouncer
    , api = props.api
    }


getSelected : Model -> Maybe Option
getSelected model =
    model.props.selected


reset : Model -> Model
reset model =
    let
        props =
            model.props
    in
    { model
        | props =
            UI.SearchSelect.View.init
                { id = props.id
                , selected = Nothing
                , optionLabel = props.optionLabel
                , label = props.label
                , searchPlaceholder = props.searchPlaceholder
                , defaultOption = props.defaultOption
                }
        , selected = Nothing
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
                    Select.update selectMsg model.props.state

                newModel =
                    model |> updateState updatedSelectState

                command =
                    Cmd.map SelectMsg selectCmds
            in
            case action of
                Just (Select.Select selected) ->
                    ( newModel |> updateSelected (Just selected)
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
                                newModel
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
                                ++ model.props.id
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
            ( model |> updateState focusedSelectState
            , Cmd.map SelectMsg cmds
            )

        Search searchString ->
            ( model |> updateStatus UI.SearchSelect.View.Loading
            , model.api { search = searchString, callbackMsg = Fetched }
            )

        Fetched result ->
            case result of
                Ok values ->
                    ( model |> updateStatus (values |> UI.SearchSelect.View.Success)
                    , Cmd.none
                    )

                Err httpError ->
                    ( model |> updateStatus UI.SearchSelect.View.Failed
                    , Sentry.sendError <| Extra.Http.toString httpError
                    )

        DebouncerMsg subMsg ->
            Debouncer.update update debouncerConfig subMsg model

        Select value ->
            ( model |> updateSelected (Just value), Cmd.none )

        Reset ->
            ( reset model, Cmd.none )


updateStatus : UI.SearchSelect.View.Status Option -> Model -> Model
updateStatus next model =
    let
        props =
            model.props
    in
    { model | props = { props | status = next } }


updateState : Select.State -> Model -> Model
updateState next model =
    let
        props =
            model.props
    in
    { model | props = { props | state = next } }


updateSelected : Maybe Option -> Model -> Model
updateSelected next model =
    let
        props =
            model.props
    in
    { model | props = { props | selected = next }, selected = next }


debouncerConfig : Debouncer.UpdateConfig Msg Model
debouncerConfig =
    { mapMsg = DebouncerMsg
    , getDebouncer = .debouncer
    , setDebouncer = \debouncer model -> { model | debouncer = debouncer }
    }



-- View


view : Model -> Html.Html Msg
view model =
    UI.SearchSelect.View.view model.props
        { onOpen = Open
        , onSelectMsg = SelectMsg
        }
