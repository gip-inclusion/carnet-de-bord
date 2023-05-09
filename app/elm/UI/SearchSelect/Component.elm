module UI.SearchSelect.Component exposing (Model, Msg(..), getSelected, init, update, view)

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


type alias Model a =
    { props : UI.SearchSelect.View.Props a
    , selected : Maybe a
    , debouncer : Debouncer.Debouncer (Msg a)
    , api :
        { search : String
        , callbackMsg : Result Http.Error (List a) -> Msg a
        }
        -> Cmd (Msg a)
    }


init :
    { id : String
    , selected : Maybe a
    , api :
        { search : String
        , callbackMsg : Result Http.Error (List a) -> Msg a
        }
        -> Cmd (Msg a)
    , optionLabel : a -> String
    , label : String
    , searchPlaceholder : String
    , defaultOption : String
    }
    -> Model a
init props =
    { props =
        UI.SearchSelect.View.init
            { id = props.id
            , selected = props.selected
            , optionLabel = props.optionLabel
            , label = props.label
            , searchPlaceholder = props.searchPlaceholder
            , defaultOption = props.defaultOption
            }
    , selected = props.selected
    , debouncer = debounce (fromSeconds 0.5) |> toDebouncer
    , api = props.api
    }


getSelected : Model a -> Maybe a
getSelected model =
    model.props.selected



-- Update


type Msg a
    = Fetched (Result Http.Error (List a))
    | Search String
    | Open
    | SelectMsg (Select.Msg a)
    | Select a
    | DebouncerMsg (Debouncer.Msg (Msg a))


update : Msg a -> Model a -> ( Model a, Cmd (Msg a) )
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

                -- Because it's being used as a dropdown we want a fresh state
                -- every time an action is clicked.
                ( _, focusedSelectState, cmds ) =
                    -- Focusing the select. Using the Select Cmd
                    -- ensures the menu is open on focus which is what you probably want
                    -- for a dropdown menu.
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
                    ( model |> updateStatus (UI.SearchSelect.View.Success values), Cmd.none )

                Err httpError ->
                    ( model |> updateStatus UI.SearchSelect.View.Failed
                    , Sentry.sendError <| Extra.Http.toString httpError
                    )

        DebouncerMsg subMsg ->
            Debouncer.update update debouncerConfig subMsg model

        Select value ->
            ( model |> updateSelected (Just value), Cmd.none )


updateStatus : UI.SearchSelect.View.Status a -> Model a -> Model a
updateStatus next model =
    let
        props =
            model.props
    in
    { model | props = { props | status = next } }


updateState : Select.State -> Model a -> Model a
updateState next model =
    let
        props =
            model.props
    in
    { model | props = { props | state = next } }


updateSelected : Maybe a -> Model a -> Model a
updateSelected next model =
    let
        props =
            model.props
    in
    { model | props = { props | selected = next }, selected = next }


debouncerConfig : Debouncer.UpdateConfig (Msg a) (Model a)
debouncerConfig =
    { mapMsg = DebouncerMsg
    , getDebouncer = .debouncer
    , setDebouncer = \debouncer model -> { model | debouncer = debouncer }
    }



-- View


view : Model a -> Html.Html (Msg a)
view model =
    UI.SearchSelect.View.view model.props
        { onOpen = Open
        , onSelectMsg = SelectMsg
        }